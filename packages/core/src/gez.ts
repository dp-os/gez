import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { cwd } from 'node:process';
import type { ImportMap } from '@gez/import';
import write from 'write';

import serialize from 'serialize-javascript';
import { type App, createApp } from './app';
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
import type { ImportmapMode } from './render-context';
import { type CacheHandle, createCache } from './utils/cache';
import { getImportMap } from './utils/import-map';
import { type ProjectPath, resolvePath } from './utils/resolve-path';
import { getImportPreloadInfo } from './utils/static-import-lexer';

/**
 * Gez 框架的核心配置选项接口
 */
export interface GezOptions {
    /**
     * 项目根目录路径
     * - 可以是绝对路径或相对路径
     * - 默认为当前工作目录 (process.cwd())
     */
    root?: string;

    /**
     * 是否为生产环境
     * - true: 生产环境
     * - false: 开发环境
     * - 默认根据 process.env.NODE_ENV === 'production' 判断
     */
    isProd?: boolean;

    /**
     * 基础路径占位符配置
     * - string: 自定义占位符
     * - false: 禁用占位符
     * - 默认值为 '[[[___GEZ_DYNAMIC_BASE___]]]'
     * - 用于运行时动态替换资源的基础路径
     */
    basePathPlaceholder?: string | false;

    /**
     * 模块配置选项
     * - 用于配置项目的模块解析规则
     * - 包括模块别名、外部依赖等配置
     */
    modules?: ModuleConfig;

    /**
     * 打包配置选项
     * - 用于将构建产物打包成标准的 npm .tgz 格式软件包
     * - 包括输出路径、package.json 处理、打包钩子等配置
     */
    packs?: PackConfig;

    /**
     * 开发环境应用创建函数
     * - 仅在开发环境中使用
     * - 用于创建开发服务器的应用实例
     * @param gez Gez实例
     */
    devApp?: (gez: Gez) => Promise<App>;

    /**
     * 服务器启动配置函数
     * - 用于配置和启动 HTTP 服务器
     * - 在开发环境和生产环境中都可使用
     * @param gez Gez实例
     */
    server?: (gez: Gez) => Promise<void>;

    /**
     * 构建后置处理函数
     * - 在项目构建完成后执行
     * - 可用于执行额外的资源处理、部署等操作
     * @param gez Gez实例
     */
    postBuild?: (gez: Gez) => Promise<void>;
}

/**
 * 应用程序构建目标类型。
 * - client: 客户端构建目标，用于生成浏览器端运行的代码
 * - server: 服务端构建目标，用于生成 Node.js 环境运行的代码
 */
export type AppBuildTarget = 'client' | 'server';

/**
 * Gez 框架的命令枚举。
 * 用于控制框架的运行模式和生命周期。
 */
export enum COMMAND {
    /**
     * 开发模式。
     * - 启动开发服务器
     * - 支持热更新
     * - 提供开发调试工具
     */
    dev = 'dev',

    /**
     * 构建模式。
     * - 生成生产环境的构建产物
     * - 优化和压缩代码
     * - 生成资源清单
     */
    build = 'build',

    /**
     * 预览模式。
     * - 预览构建产物
     * - 验证构建结果
     * - 模拟生产环境
     */
    preview = 'preview',

    /**
     * 启动模式。
     * - 启动生产环境服务器
     * - 加载构建产物
     * - 提供生产级性能
     */
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
    // 基础属性和构造函数
    private readonly _options: GezOptions;
    private _readied: Readied | null = null;
    private _importmapHash: string | null = null;

    public constructor(options: GezOptions = {}) {
        this._options = options;
    }

    private get readied() {
        if (this._readied) {
            return this._readied;
        }
        throw new NotReadyError();
    }

    // 生命周期相关方法
    public async init(command: COMMAND): Promise<boolean> {
        if (this._readied) {
            throw new Error('Cannot be initialized repeatedly');
        }

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

        const devApp = this._options.devApp || defaultDevApp;
        const app: App = [COMMAND.dev, COMMAND.build].includes(command)
            ? await devApp(this)
            : await createApp(this, command);

        this.readied.app = app;

        switch (command) {
            case COMMAND.dev:
            case COMMAND.start:
                await this.server();
                break;
            case COMMAND.build:
                return this.build();
            case COMMAND.preview:
                break;
        }
        return true;
    }

    public async destroy(): Promise<boolean> {
        const { readied } = this;
        if (readied.app?.destroy) {
            return readied.app.destroy();
        }
        return true;
    }

    public async build(): Promise<boolean> {
        const startTime = Date.now();
        console.log('[gez]: build start');

        const successful = await this.readied.app.build?.();

        const endTime = Date.now();
        console.log(`[gez]: build end, cost: ${endTime - startTime}ms`);

        return successful ?? true;
    }

    public async server(): Promise<void> {
        await this._options?.server?.(this);
    }

    public async postBuild(): Promise<boolean> {
        try {
            await this._options.postBuild?.(this);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // 配置相关的 getter 方法
    public get name() {
        return this.moduleConfig.name;
    }

    public get varName() {
        return '__' + this.name.replace(/[^a-zA-Z]/g, '_') + '__';
    }

    public get root(): string {
        const { root = cwd() } = this._options;
        if (path.isAbsolute(root)) {
            return root;
        }
        return path.resolve(cwd(), root);
    }

    public get isProd(): boolean {
        return this._options?.isProd ?? process.env.NODE_ENV === 'production';
    }

    public get basePath() {
        return `/${this.name}/`;
    }

    public get basePathPlaceholder(): string {
        const varName = this._options.basePathPlaceholder;
        if (varName === false) {
            return '';
        }
        return varName ?? '[[[___GEZ_DYNAMIC_BASE___]]]';
    }

    public get command(): COMMAND {
        return this.readied.command;
    }

    public get COMMAND() {
        return COMMAND;
    }

    public get moduleConfig() {
        return this.readied.moduleConfig;
    }

    public get packConfig() {
        return this.readied.packConfig;
    }

    public get middleware() {
        return this.readied.app.middleware;
    }

    public get render() {
        return this.readied.app.render;
    }

    // 文件操作相关方法
    public resolvePath(projectPath: ProjectPath, ...args: string[]): string {
        return resolvePath(this.root, projectPath, ...args);
    }

    public writeSync(filepath: string, data: any): void {
        write.sync(filepath, data);
    }

    public async write(filepath: string, data: any): Promise<boolean> {
        try {
            await write(filepath, data);
            return true;
        } catch {
            return false;
        }
    }

    public readJsonSync(filename: string): any {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    }

    public async readJson(filename: string): Promise<any> {
        return JSON.parse(await fsp.readFile(filename, 'utf-8'));
    }

    // importmap 相关方法
    public async getManifestList(
        target: AppBuildTarget
    ): Promise<readonly ManifestJson[]> {
        return this.readied.cache(`getManifestList-${target}`, async () =>
            Object.freeze(await getManifestList(target, this.moduleConfig))
        );
    }

    public async getImportMap(
        target: AppBuildTarget
    ): Promise<Readonly<ImportMap>> {
        return this.readied.cache(`getImportMap-${target}`, async () => {
            const json = await getImportMap(
                target,
                await this.getManifestList(target),
                this.moduleConfig
            );
            return Object.freeze(json);
        });
    }

    public async getImportMapClientInfo<T extends ImportmapMode>(
        mode: T
    ): Promise<
        T extends 'js'
            ? {
                  src: string;
                  filepath: string;
                  code: string;
              }
            : {
                  src: null;
                  filepath: null;
                  code: string;
              }
    > {
        return this.readied.cache(
            `getImportMap-${mode}`,
            async (): Promise<any> => {
                const importmap = await this.getImportMap('client');
                const { basePathPlaceholder } = this;
                let filepath: string | null = null;
                if (this._importmapHash === null) {
                    let wrote = false;
                    const code = `(() => {
const base = document.currentScript.getAttribute('data-base');
const importmap = ${serialize(importmap, { isJSON: true })};
if (importmap.imports && base) {
    const imports = importmap.imports;
    Object.entries(imports).forEach(([k, v]) => {
        imports[k] = base + v;
    });
}
document.head.appendChild(Object.assign(document.createElement('script'), {
type: 'importmap',
innerHTML: JSON.stringify(importmap)
}));
})();`;
                    const hash = contentHash(code);
                    filepath = this.resolvePath(
                        'dist/client/importmap',
                        `${hash}.final.js`
                    );
                    try {
                        const existingContent = await fsp.readFile(
                            filepath,
                            'utf-8'
                        );
                        if (existingContent === code) {
                            wrote = true;
                        } else {
                            wrote = await this.write(filepath, code);
                        }
                    } catch {
                        wrote = await this.write(filepath, code);
                    }
                    this._importmapHash = wrote ? hash : '';
                }
                if (mode === 'js' && this._importmapHash) {
                    const src = `${basePathPlaceholder}${this.basePath}importmap/${this._importmapHash}.final.js`;
                    return {
                        src,
                        filepath,
                        code: `<script data-base="${basePathPlaceholder}" src="${src}"></script>`
                    };
                }
                if (importmap.imports && basePathPlaceholder) {
                    const imports = importmap.imports;
                    Object.entries(imports).forEach(([k, v]) => {
                        imports[k] = basePathPlaceholder + v;
                    });
                }
                return {
                    src: null,
                    filepath: null,
                    code: `<script type="importmap">${serialize(importmap, { isJSON: true })}</script>`
                };
            }
        );
    }

    public async getStaticImportPaths(
        target: AppBuildTarget,
        specifier: string
    ) {
        return this.readied.cache(
            `getStaticImportPaths-${target}-${specifier}`,
            async () => {
                const preloadInfo = await getImportPreloadInfo(
                    specifier,
                    await this.getImportMap(target),
                    this.moduleConfig
                );
                if (!preloadInfo) {
                    return null;
                }
                return Object.freeze(Object.values(preloadInfo));
            }
        );
    }
}

async function defaultDevApp(): Promise<App> {
    throw new Error("'devApp' function not set");
}

class NotReadyError extends Error {
    constructor() {
        super(`The Gez has not been initialized yet`);
    }
}

function contentHash(text: string) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex').substring(0, 12);
}
