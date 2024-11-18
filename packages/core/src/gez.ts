import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import type { ImportMap } from '@gez/import';
import write from 'write';

import { type App, createApp } from './app';
import type { ManifestJson } from './manifest-json';
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

export enum COMMAND {
    dev = 'dev',
    build = 'build',
    preview = 'preview',
    start = 'start'
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
     * 获取 dist/node/src/entry.node.js 文件导出的选项
     */
    public static async getDistOptions(): Promise<GezOptions> {
        return import(path.resolve(process.cwd(), './src/entry.node.ts')).then(
            (m) => m.default
        );
    }
    private readonly _options: GezOptions;
    private _app: App | null = null;
    private _command: COMMAND | null = null;
    /**
     * 根据传入的 modules 选项解析出来的对象。
     */
    readonly moduleConfig: ParsedModuleConfig;
    readonly packConfig: ParsedPackConfig;
    public constructor(options: GezOptions = {}) {
        this._options = options;
        const name = this.readJsonSync(
            path.resolve(this.root, 'package.json')
        ).name;
        this.moduleConfig = parseModuleConfig(name, this.root, options.modules);
        this.packConfig = parsePackConfig(options.packs);
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
        const { _command } = this;
        if (_command) {
            return _command;
        }
        throw new Error(`'command' does not exist`);
    }
    /**
     * 全部命令的枚举对象。
     */
    public get COMMAND() {
        return COMMAND;
    }

    private get app() {
        const { _app } = this;
        if (_app) {
            return _app;
        }
        throw new Error(`'app' does not exist`);
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
        if (this._command) {
            throw new Error('Cannot be initialized repeatedly');
        }
        const createDevApp = this._options.createDevApp || defaultCreateDevApp;

        this._command = command;
        const app: App =
            // 只有 dev 和 build 时使用createDevApp
            [COMMAND.dev, COMMAND.build].includes(command)
                ? await createDevApp(this)
                : await createApp(this);
        this._app = app;
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
        const { _app } = this;
        if (_app?.destroy) {
            return _app.destroy();
        }
        return true;
    }
    /**
     * 构建生产代码。
     */
    public async build(): Promise<boolean> {
        const startTime = Date.now();
        console.log('[gez]: build start');

        const successful = await this.app?.build?.();

        const endTime = Date.now();
        console.log(`[gez]: build end, cost: ${endTime - startTime}ms`);

        return successful ?? true;
    }
    /**
     * 中间件。
     */
    public get middleware() {
        return this.app.middleware;
    }
    /**
     * 调用 entry.server.ts 导出的渲染函数。
     */
    public get render() {
        return this.app.render;
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
    public writeSync(filepath: string, data: any) {
        write.sync(filepath, data);
    }
    /**
     * 异步的读取一个 JSON 文件。
     */
    public readJsonSync(filename: string): any {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    }
    /**
     * 获取全部服务的清单文件。
     */
    public getManifestList(target: 'client' | 'server'): ManifestJson[] {
        return this.moduleConfig.imports.map((item) => {
            const filename = path.resolve(
                item.localPath,
                target,
                'manifest.json'
            );
            try {
                const text = fs.readFileSync(filename, 'utf-8');
                const data = JSON.parse(text);
                data.name = item.name;
                return data;
            } catch (e) {
                throw new Error(
                    `'${item.name}' service '${target}/manifest.json' file read error`
                );
            }
        });
    }
    /**
     * 获取服务端的 importmap 映射文件。
     */
    public getServerImportMap(): ImportMap {
        const imports: Record<string, string> = {};
        this.getManifestList('server').forEach((manifest) => {
            const importItem = this.moduleConfig.imports.find((item) => {
                return item.name === manifest.name;
            });
            if (!importItem) {
                throw new Error(
                    `'${manifest.name}' service did not find module config`
                );
            }
            Object.entries(manifest.exports).forEach(([name, value]) => {
                imports[`${manifest.name}/${name.substring(2)}`] = path.resolve(
                    importItem.localPath,
                    'server',
                    value
                );
            });
        });
        return {
            imports
        };
    }
}

async function defaultCreateDevApp(): Promise<App> {
    throw new Error("'createDevApp' function not set");
}
