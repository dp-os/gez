import { type IncomingMessage, type ServerResponse } from 'node:http';

import {
    type App,
    type AppRenderParams,
    COMMAND,
    type Gez,
    ServerContext,
    type ServerRender
} from '@gez/core';
import { type Compiler, rspack } from '@rspack/core';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import type { ConfigCallback } from './config';
import { importEsm } from './import-esm';

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
            const module = await importEsm(
                gez.getProjectPath('dist/server/entry-server.js')
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
                compiler.close((closeErr) => {
                    if (err) {
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
            console.log('@importList', importList);
            console.log('@imports', importTargets.imports);

            const results = await Promise.all(
                importList.map(async (name) => {
                    const baseUrl = importBase[name] || importBase['*'] || '';
                    if (baseUrl) {
                        const fullPath = `${baseUrl}/${name}/importmap.json`;
                        console.log('@fullPath', fullPath);

                        const res = await fetch(fullPath);
                        if (!res.body) return;
                        const reader = res.body.getReader();
                        const stream = new ReadableStream({
                            start(controller) {
                                function push() {
                                    reader.read().then(({ done, value }) => {
                                        if (done) {
                                            controller.close();
                                            return;
                                        }
                                        controller.enqueue(value);
                                        push();
                                    });
                                }
                                push();
                            }
                        });
                        const result = await new Response(stream, {
                            headers: { 'Content-Type': 'text/html' }
                        }).text();
                        // console.log('@result', result);
                        return result;
                    }
                })
            );
            console.log('@install end');
        }
    };
}
