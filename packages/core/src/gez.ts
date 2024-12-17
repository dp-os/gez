import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { cwd } from 'node:process';
import type { ImportMap } from '@gez/import';
import write from 'write';

import { type App, createApp } from './app';
import { type CacheHandle, createCache } from './cache';
import { getImportMap } from './import-map';
import { type ManifestJson, getManifestList } from './manifest-json';
import {
    type ModuleConfig,
    type ParsedModuleConfig,
    parseModuleConfig
} from './module-config';
import {
    type PackConfig,
    type ParsedPackConfig,
    parsePackConfig
} from './pack-config';
import { type ProjectPath, resolvePath } from './resolve-path';
import { getImportPreloadInfo } from './static_import_lexer';

/**
 * 详细说明，请看文档：https://dp-os.github.io/gez/api/gez.html
 */
export interface GezOptions {
    /**
     * 项目根目录，默认为当前执行命令的目录。
     */
    root?: string;
    /**
     * 是否是生产环境。
     */
    isProd?: boolean;
    /**
     * 动态路径的变量占位符。
     */
    basePathPlaceholder?: string | false;
    /**
     * 模块链接配置。
     */
    modules?: ModuleConfig;
    /**
     * 是否启用归档，等同于 npm pack。
     */
    packs?: PackConfig;
    /**
     * 创建开发应用，在执行 dev、build、preview 命令时调用。
     */
    createDevApp?: (gez: Gez) => Promise<App>;
    /**
     * 创建服务器，执行 dev、build、preview 命令时调用。
     */
    createServer?: (gez: Gez) => Promise<void>;
    /**
     * gez build 构建完成后，以生产模式执行的钩子。
     */
    postCompileProdHook?: (gez: Gez) => Promise<void>;
}

/**
 * 同构应用的编译目标
 */
export type AppBuildTarget = 'client' | 'server';

/**
 * 应用程序执行的动作
 */
export enum COMMAND {
    dev = 'dev',
    build = 'build',
    preview = 'preview',
    start = 'start'
}

export type { ImportMap };

interface Readied {
    app: App;
    command: COMMAND;
    moduleConfig: ParsedModuleConfig;
    packConfig: ParsedPackConfig;
    cache: CacheHandle;
}

export class Gez {
    /**
     * 获取 src/entry.node.ts 文件导出的选项
     */
    public static async getSrcOptions(): Promise<GezOptions> {
        return import(path.resolve(process.cwd(), './src/entry.node.ts')).then(
            (m) => m.default
        );
    }
    /**
     * 获取 dist/node/src/entry.node.mjs 文件导出的选项
     */
    public static async getDistOptions(): Promise<GezOptions> {
        return import(path.resolve(process.cwd(), './src/entry.node.ts')).then(
            (m) => m.default
        );
    }
    /**
     * 传入的选项
     */
    private readonly _options: GezOptions;
    /**
     * 程序是否准备就绪
     */
    private _readied: Readied | null = null;
    public constructor(options: GezOptions = {}) {
        this._options = options;
    }
    private get readied() {
        if (this._readied) {
            return this._readied;
        }
        throw new NotReadyError();
    }

    /**
     * 服务名称，来源于 package.json 文件的 name 字段。
     */
    public get name() {
        return this.moduleConfig.name;
    }
    /**
     * 根据 name 生成的 JS 变量名称。
     */
    public get varName() {
        return '__' + this.name.replace(/[^a-zA-Z]/g, '_') + '__';
    }
    /**
     * 项目根目录。
     */
    public get root(): string {
        const { root = cwd() } = this._options;
        if (path.isAbsolute(root)) {
            return root;
        }
        return path.resolve(cwd(), root);
    }
    /**
     * 是否是生产环境。
     */
    public get isProd(): boolean {
        return this._options?.isProd ?? process.env.NODE_ENV === 'production';
    }

    /**
     * 根据服务名称生成的静态资源基本路径。
     */
    public get basePath() {
        return `/${this.name}/`;
    }
    /**
     * 动态的 base 地址占位符。
     */
    public get basePathPlaceholder(): string {
        const varName = this._options.basePathPlaceholder;
        if (varName === false) {
            return '';
        }
        return varName ?? '[[[___GEZ_DYNAMIC_BASE___]]]';
    }

    /**
     * 当前执行的命令。
     */
    public get command(): COMMAND {
        return this.readied.command;
    }
    /**
     * 全部命令的枚举对象。
     */
    public get COMMAND() {
        return COMMAND;
    }
    /**
     * 模块解析配置
     */
    public get moduleConfig() {
        return this.readied.moduleConfig;
    }
    /**
     * 归档解析配置
     */
    public get packConfig() {
        return this.readied.packConfig;
    }

    /**
     * 执行下面的命令，会创建服务器。
     * - gez dev
     * - gez start
     * - gez preview
     */
    public async createServer(): Promise<void> {
        await this._options?.createServer?.(this);
    }
    /**
     * 执行 gez build 命令回调。
     */
    public async postCompileProdHook(): Promise<boolean> {
        try {
            await this._options.postCompileProdHook?.(this);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 初始化实例。
     */
    public async init(command: COMMAND): Promise<boolean> {
        if (this._readied) {
            throw new Error('Cannot be initialized repeatedly');
        }

        // 初始化实例
        const { name } = await this.readJson(
            path.resolve(this.root, 'package.json')
        );
        const moduleConfig = parseModuleConfig(
            name,
            this.root,
            this._options.modules
        );
        const packConfig = parsePackConfig(this._options.packs);
        this._readied = {
            command,
            app: {
                middleware() {
                    throw new NotReadyError();
                },
                async render() {
                    throw new NotReadyError();
                }
            },
            moduleConfig,
            packConfig,
            cache: createCache(this.isProd)
        };

        // 更新正确的 App 实例
        const createDevApp = this._options.createDevApp || defaultCreateDevApp;
        const app: App =
            // 只有 dev 和 build 时使用 createDevApp
            [COMMAND.dev, COMMAND.build].includes(command)
                ? await createDevApp(this)
                : await createApp(this, command);

        this.readied.app = app;

        switch (command) {
            case COMMAND.dev:
            case COMMAND.start:
                await this.createServer();
                break;
            case COMMAND.build:
                return this.build();
            case COMMAND.preview:
                break;
        }
        return true;
    }
    /**
     * 销毁实例，释放内存。
     */
    public async destroy(): Promise<boolean> {
        const { readied } = this;
        if (readied.app?.destroy) {
            return readied.app.destroy();
        }
        return true;
    }
    /**
     * 构建生产代码。
     */
    public async build(): Promise<boolean> {
        const startTime = Date.now();
        console.log('[gez]: build start');

        const successful = await this.readied.app.build?.();

        const endTime = Date.now();
        console.log(`[gez]: build end, cost: ${endTime - startTime}ms`);

        return successful ?? true;
    }
    /**
     * 中间件。
     */
    public get middleware() {
        return this.readied.app.middleware;
    }
    /**
     * 调用 entry.server.ts 导出的渲染函数。
     */
    public get render() {
        return this.readied.app.render;
    }
    /**
     * 解析项目路径。
     */
    public resolvePath(projectPath: ProjectPath, ...args: string[]): string {
        return resolvePath(this.root, projectPath, ...args);
    }
    /**
     * 同步写入一个文件。
     */
    public writeSync(filepath: string, data: any): void {
        write.sync(filepath, data);
    }
    /**
     * 异步写入一个文件。
     */
    public async write(filepath: string, data: any): Promise<void> {
        await write(filepath, data);
    }
    /**
     * 同步的读取一个 JSON 文件。
     */
    public readJsonSync(filename: string): any {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    }
    /**
     * 异步的读取一个 JSON 文件。
     */
    public async readJson(filename: string): Promise<any> {
        return JSON.parse(await fsp.readFile(filename, 'utf-8'));
    }
    /**
     * 获取服务清单文件，仅只读。
     */
    public async getManifestList(
        target: AppBuildTarget
    ): Promise<readonly ManifestJson[]> {
        return this.readied.cache(`getManifestList-${target}`, async () =>
            Object.freeze(await getManifestList(target, this.moduleConfig))
        );
    }
    /**
     * 获取导入映射对象，仅只读。
     * @param target 构建目标
     * @param withoutIndex 是否去掉模块名和路径中的 /index
     * @returns 导入映射对象
     */
    public async getImportMap(
        target: AppBuildTarget,
        withoutIndex = true
    ): Promise<Readonly<ImportMap>> {
        return this.readied.cache(
            `getImportMap-${target}-${withoutIndex}`,
            () =>
                Object.freeze(
                    getImportMap(
                        target,
                        withoutIndex,
                        this.getManifestList(target),
                        this.moduleConfig
                    )
                )
        );
    }
    /**
     * 获取导入的预加载信息。只有 client 端有效。仅只读。
     * @param specifier 模块名
     * @returns
     *   - `Promise<{ [specifier: string]: ImportPreloadPathString }>` 模块名和文件路径的映射对象
     *   - `null` specifier 不存在
     */
    public async getImportPreloadInfo(specifier: string) {
        return this.readied.cache(
            `getImportPreloadInfo-client-${specifier}`,
            () =>
                Object.freeze(
                    getImportPreloadInfo(
                        specifier,
                        this.getImportMap('client'),
                        this.moduleConfig
                    )
                )
        );
    }
    /**
     * 获取导入的预加载路径。只有 client 端有效。仅只读。
     * @param specifier 模块名
     * @returns
     *   - `Promise<string[]>` 文件路径数组
     *   - `null` specifier 不存在
     */
    public async getImportPreloadPaths(specifier: string) {
        return this.readied.cache(
            `getImportPreloadPaths-client-arr-${specifier}`,
            async () => {
                const preloadInfo = await this.getImportPreloadInfo(specifier);
                if (!preloadInfo) {
                    return null;
                }
                return Object.freeze(Object.values(preloadInfo));
            }
        );
    }
}

async function defaultCreateDevApp(): Promise<App> {
    throw new Error("'createDevApp' function not set");
}

class NotReadyError extends Error {
    constructor() {
        super(`The Gez has not been initialized yet`);
    }
}
