import { execSync } from 'node:child_process';
import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

import {
    type App,
    type AppRenderParams,
    COMMAND,
    type Gez,
    ServerContext,
    type ServerRender
} from '@gez/core';
import { type Compiler, rspack } from '@rspack/core';
import crypto from 'crypto-js';
import * as fflate from 'fflate';
import find from 'find';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import write from 'write';

import type { ConfigCallback } from './config';
import { importEsmInactive } from './import-esm';

interface ManifestJson {
    client: {
        importmapFilePath: string;
        version: string;
        files: string[];
    };
    server: {
        dts: boolean;
        version: string;
        files: string[];
    };
}

function middleware(gez: Gez, config: ConfigCallback) {
    let clientCompiler: Compiler | null = null;
    let dev = (req: IncomingMessage, res: ServerResponse, next?: Function) => {
        return next?.();
    };
    let hot = dev;
    if (gez.command === COMMAND.dev) {
        const clientConfig = config(gez, 'client');
        const serverConfig = config(gez, 'server');
        clientCompiler = rspack(clientConfig);
        const serverCompiler = rspack(serverConfig);
        // @ts-expect-error
        webpackDevMiddleware(serverCompiler, {
            publicPath: gez.base,
            writeToDisk: true
        });
        // @ts-expect-error
        dev = webpackDevMiddleware(clientCompiler, {
            writeToDisk: true,
            publicPath: gez.base
        });
        // @ts-expect-error
        hot = webpackHotMiddleware(clientCompiler, {
            heartbeat: 5000,
            path: `${gez.base}hot-middleware`
        });
    }
    return (req: IncomingMessage, res: ServerResponse, next?: Function) => {
        dev(req, res, () => {
            hot(req, res, next);
        });
    };
}

export async function createApp(
    gez: Gez,
    config: ConfigCallback
): Promise<App> {
    return {
        middleware: middleware(gez, config),
        async render(params: AppRenderParams): Promise<ServerContext> {
            const module = await importEsmInactive(
                gez.getProjectPath('dist/server/entry-server.js'),
                import.meta.url,
                {
                    console,
                    process,
                    URL,
                    global
                }
            );
            const render: ServerRender | undefined = module.default;
            const context = new ServerContext(gez, params);
            if (typeof render === 'function') {
                await render(context);
            }
            return context;
        },
        build() {
            const clientConfig = config(gez, 'client');
            const serverConfig = config(gez, 'server');
            const nodeConfig = config(gez, 'node');
            const compiler = rspack([clientConfig, serverConfig, nodeConfig]);
            let done = () => {};
            compiler.run((err: Error) => {
                if (err) {
                    throw err;
                }
                buildImportmap(gez);
                compiler.close((closeErr) => {
                    if (closeErr) {
                        throw closeErr;
                    }
                    done();
                });
            });
            return new Promise<void>((resolve) => {
                done = resolve;
            });
        },
        async destroy() {},
        async install() {
            if (!gez.modules) return;
            const { importBase, imports = [] } = gez.modules;
            const regex = /^(.*?)\/(.*)$/; // 使用正则表达式匹配第一个/符号
            const importTargets = imports.reduce<{
                targets: Record<string, Record<string, string>>;
                imports: Record<string, string>;
            }>(
                (acc, item) => {
                    const match = item.match(regex);

                    if (match) {
                        const [, part1, part2] = match;
                        const origin =
                            importBase[part1] || importBase['*'] || '';
                        const fullPath = `${origin}/${part2}`;

                        const target = acc.targets[part1];
                        if (target) {
                            target[item] = fullPath;
                        } else {
                            acc.targets[part1] = {
                                [item]: fullPath
                            };
                        }
                        acc.imports[item] = fullPath;
                    }
                    return acc;
                },
                {
                    targets: {},
                    imports: {}
                }
            );
            const importList = Object.keys(importTargets.targets);

            // importTargets.targets.forEach((value, key) => {
            //     console.log(`@import ${key}`, value);
            // });

            const results = await Promise.allSettled(
                importList.map(async (name) => {
                    const baseUrl = importBase[name] || importBase['*'] || '';
                    if (baseUrl) {
                        const fullPath = `${baseUrl}/server/manifest.json`;

                        const res = await fetch(fullPath);
                        if (!res.ok || !res.body) return;
                        const buffer = Buffer.from(await res.arrayBuffer());
                        try {
                            const manifest: ManifestJson = JSON.parse(
                                buffer.toString()
                            );
                            const { dts, version } = manifest.server;
                            const dir = path.resolve(
                                gez.root,
                                `node_modules/${name}`
                            );
                            execSync(`rm -rf ${dir}`);
                            unzipRemoteFile(
                                `${baseUrl}/server/${version}.zip`,
                                dir
                            );
                            if (dts) {
                                unzipRemoteFile(
                                    `${baseUrl}/server/${version}.dts.zip`,
                                    dir
                                );
                            }
                        } catch (error) {}
                    }
                })
            );
        }
    };
}

function buildImportmap(gez: Gez) {
    if (!gez.moduleConfig) return;
    const { typeDir } = gez.moduleConfig;
    const dtsDir = path.resolve(gez.root, typeDir || '');
    const dtsExist = typeDir ? fs.existsSync(dtsDir) : false;

    const { files: clientFiles, fileList: clientFileList } = readFileDirectory(
        path.resolve(gez.root, 'dist/client')
    );
    const { contenthash: clientHash } = zipFiles(clientFiles);

    const { files: serverFiles, fileList: serverFileList } = readFileDirectory(
        path.resolve(gez.root, 'dist/server')
    );
    const { zipU8: serverZipped, contenthash: serverHash } =
        zipFiles(serverFiles);
    write.sync(
        path.resolve(gez.root, `dist/client/server/${serverHash}.zip`),
        serverZipped
    );

    if (dtsExist) {
        const { files: typeFiles } = readFileDirectory(dtsDir);
        const { zipU8: typeZipped } = zipFiles(typeFiles);
        write.sync(
            path.resolve(gez.root, `dist/client/server/${serverHash}.dts.zip`),
            typeZipped
        );
    }

    const importmapFilePath =
        clientFileList.find((item) => {
            return (
                item.startsWith('importmap.') &&
                item.endsWith('.js') &&
                item !== 'importmap.js'
            );
        }) || '';

    const manifestJson: ManifestJson = {
        client: {
            importmapFilePath,
            version: clientHash,
            files: clientFileList
        },
        server: {
            dts: dtsExist,
            version: serverHash,
            files: serverFileList
        }
    };
    write.sync(
        path.resolve(gez.root, 'dist/client/server/manifest.json'),
        JSON.stringify(manifestJson, null, 4)
    );
}

/**
 * 读取指定目录下的所有文件，并返回一个包含文件内容和文件名列表的对象。
 *
 * @param dir - 要读取的目录路径。
 * @returns 一个包含文件内容和文件名列表的对象。
 */
function readFileDirectory(dir: string): {
    files: Record<string, any>;
    fileList: string[];
} {
    const files: Record<string, any> = {};
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory) {
        return {
            files: {},
            fileList: []
        };
    }
    find.fileSync(dir).forEach((filename: string) => {
        const text = fs.readFileSync(filename);
        files[path.relative(dir, filename)] = text;
    });
    return {
        files,
        fileList: Object.keys(files)
    };
}

/**
 * 将文件对象压缩成zip文件，并计算其内容的哈希值。
 *
 * @param files - 要压缩的文件对象。
 * @returns 一个包含压缩文件和内容哈希值的对象。
 */
function zipFiles(files: Record<string, any>) {
    const zipU8 = fflate.zipSync(files);
    const contenthash = crypto.MD5(zipU8.toString()).toString().slice(0, 8);
    return {
        zipU8,
        contenthash
    };
}

/**
 * 解压缩 Uint8Array 数据到指定目录
 * @param data - 要解压缩的 Uint8Array 数据
 * @param dir - 目标解压缩目录的路径
 * @param options - 解压缩选项
 * @throws {Error} 如果解压缩过程中发生错误
 */
function unzip(data: Uint8Array, dir: string, options?: fflate.UnzipOptions) {
    let files: Record<string, any> = {};
    try {
        files = fflate.unzipSync(data, options);
    } catch (e) {}
    Object.keys(files).forEach((name) => {
        write.sync(path.resolve(dir, name), files[name]);
    });
}

/**
 * 异步获取并解压 ZIP 文件到指定目录
 * @param url - 要获取的 ZIP 文件的 URL
 * @param dir - 要解压到的目标目录
 * @returns
 */
async function unzipRemoteFile(url: string, dir: string) {
    const res = await fetch(url);
    if (!res.ok || !res.body) return;
    const buffer = new Uint8Array(await res.arrayBuffer());

    unzip(buffer, dir);
}
