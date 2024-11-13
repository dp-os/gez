import path from 'node:path';
import { cwd } from 'node:process';
import write from 'write';

import { type App, createApp } from './app';
import {
    type ModuleConfig,
    type ParsedModuleConfig,
    parseModuleConfig
} from './module-config';
import { moduleLink } from './module-link';
import { type ProjectPath, getProjectPath } from './project-path';

/**
 * 详细说明，请看文档：https://dp-os.github.io/gez/api/gez.html
 */
export interface GezOptions {
    name?: string;
    root?: string;
    isProd?: boolean;
    isInstall?: boolean;
    basePathPlaceholder?: string | false;
    modules?: ModuleConfig;
    postCompileProdHook?: (gez: Gez) => Promise<void>;
    createDevApp?: (gez: Gez) => Promise<App>;
    createServer?: (gez: Gez) => Promise<void>;
}

export enum COMMAND {
    dev = 'dev',
    build = 'build',
    release = 'release',
    preview = 'preview',
    install = 'install',
    start = 'start'
}

export interface PackageJsonChunks {
    /**
     * 当前编译的 JS 文件。
     */
    js: string;
    /**
     * 当前编译的 CSS 文件。
     */
    css: string[];
    /**
     * 其它的资源文件。
     */
    resources: string[];
    /**
     * 构建产物的大小。
     */
    sizes: PackageJsonChunkSizes;
}

export interface PackageJsonChunkSizes {
    js: number;
    css: number;
    resource: number;
}

export interface PackageJson {
    /**
     * 服务名字，来自于：GezOptions.name
     */
    name: string;
    /**
     * 版本号，默认为 1.0.0
     */
    version: string;
    /**
     * 构建的版本号
     */
    hash: string;
    /**
     * 模块系统
     */
    type: 'module';
    /**
     * 对外导出的文件
     */
    exports: Record<string, string>;
    /**
     * 构建的全部文件清单
     */
    files: string[];
    /**
     * 编译的文件信息
     * 类型：Record<源文件, 编译信息>
     */
    chunks: Record<string, PackageJsonChunks>;
}
function noon(gez: Gez) {}

export class Gez {
    private readonly _options: GezOptions;
    private _app: App | null = null;
    private _command: COMMAND | null = null;
    readonly moduleConfig: ParsedModuleConfig;
    public constructor(options: GezOptions = {}) {
        this._options = options;
        this.moduleConfig = parseModuleConfig(
            this.name,
            this.root,
            options.modules
        );
    }

    /**
     * 服务的名称
     */
    public get name() {
        return this._options.name ?? 'gez';
    }

    /**
     * 本地开发根目录
     */
    public get root(): string {
        const { root = cwd() } = this._options;
        if (path.isAbsolute(root)) {
            return root;
        }
        return path.resolve(cwd(), root);
    }
    /**
     * 是否是生产环境
     */
    public get isProd(): boolean {
        return this._options?.isProd ?? process.env.NODE_ENV === 'production';
    }
    /**
     * 是否安装生产依赖
     */
    get isInstall() {
        return (
            this._options?.isInstall ??
            process.env.npm_config_production !== 'true'
        );
    }

    /**
     * 静态资源请求目录
     * 例如：/gez/
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
     * 当前程序执行的命令
     */
    public get command(): COMMAND {
        const { _command } = this;
        if (_command) {
            return _command;
        }
        throw new Error(`'command' does not exist`);
    }

    private get app() {
        const { _app } = this;
        if (_app) {
            return _app;
        }
        throw new Error(`'app' does not exist`);
    }
    public get _createServer() {
        return this._options.createServer ?? noon;
    }
    public get _postCompileProdHook() {
        return this._options.postCompileProdHook;
    }

    /**
     * 安装代码方法，对 npm install 的补充
     * 目前用于远程模块的安装(包括类型文件)
     */
    public install(): Promise<boolean> {
        return this.app.install();
    }

    /**
     * 构建应用代码
     */
    public async build(): Promise<boolean> {
        const startTime = Date.now();
        console.log('[gez]: build start');

        const successful = await this.app.build();

        const endTime = Date.now();
        console.log(`[gez]: build end, cost: ${endTime - startTime}ms`);

        return successful;
    }

    /**
     * 生成应用代码压缩包
     */
    public release(): Promise<boolean> {
        return this.app.release();
    }

    /**
     * 静态资源中间件
     */
    public get middleware() {
        return this.app.middleware;
    }

    /**
     * 渲染函数
     */
    public get render() {
        return this.app.render;
    }

    /**
     * 销毁实例，释放内存
     */
    public async destroy(): Promise<boolean> {
        const { _app } = this;
        if (_app) {
            return _app.destroy();
        }
        return true;
    }

    /**
     * 当前服务，生成一个全局唯一的变量名称
     */
    public get varName() {
        return '__' + this.name.replace(/[^a-zA-Z]/g, '_') + '__';
    }

    public async init(command: COMMAND) {
        if (this._command) {
            throw new Error('Cannot be initialized repeatedly');
        }
        moduleLink(this.root, this.moduleConfig);
        const createDevApp = this._options.createDevApp || defaultCreateDevApp;

        this._command = command;
        const app: App =
            // 只有 dev 和 build 时使用createDevApp
            [COMMAND.dev, COMMAND.build].includes(command)
                ? await createDevApp(this)
                : await createApp(this);
        this._app = app;
    }

    public getProjectPath(projectPath: ProjectPath): string {
        return getProjectPath(this.root, projectPath);
    }
    public writeSync(filepath: string, data: any) {
        write.sync(filepath, data);
    }
    public async write(filepath: string, data: any) {
        await write(filepath, data);
    }
}

async function defaultCreateDevApp(): Promise<App> {
    throw new Error("'createDevApp' function not set");
}
