import path from 'node:path';
import { cwd } from 'node:process';

import { type App, createApp } from './app';
import {
    type ModuleConfig,
    type ParsedModuleConfig,
    parseModuleConfig
} from './module-config';
import { moduleLink } from './module-link';
import { type ProjectPath, getProjectPath } from './project-path';

export interface GezOptions {
    /**
     * 项目的根目录
     */
    root?: string;
    /**
     * 服务名称，全局唯一
     */
    name?: string;
    /**
     * 是否是生产模式
     */
    isProd?: boolean;
    /**
     * 模块配置
     */
    modules?: ModuleConfig;
    /**
     * 当 isProd = false 时调用
     * @param gez
     * @returns
     */
    createDevApp?: (gez: Gez) => Promise<App>;
    /**
     * 创建自己的服务器
     * @param gez
     * @returns
     */
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

export interface PackageJson {
    /**
     * 服务名字，来自于：GezOptions.name
     */
    name: string;
    /**
     * 版本号
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
}

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

    private get app() {
        const { _app } = this;
        if (_app) {
            return _app;
        }
        throw new Error(`'app' does not exist`);
    }

    /**
     * 当前程序执行的命令
     */
    public get command() {
        const { _command } = this;
        if (_command) {
            return _command;
        }
        throw new Error(`'command' does not exist`);
    }

    /**
     * 安装代码方法，对 npm install 的补充
     * 目前用于远程模块的安装(包括类型文件)
     */
    public get install() {
        return this.app.install;
    }

    /**
     * 构建应用代码
     */
    public get build() {
        return async () => {
            const startTime = Date.now();
            console.log('[gez]: build start');

            const successful = await this.app.build();

            const endTime = Date.now();
            console.log(`[gez]: build end, cost: ${endTime - startTime}ms`);

            return successful;
        };
    }

    /**
     * 生成应用代码压缩包
     */
    public get release() {
        return this.app.release;
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
    public async destroy() {
        const { _app } = this;
        if (_app) {
            return _app.destroy();
        }
        return true;
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
     * 静态资源请求目录
     * 例如：/gez/
     */
    public get base() {
        return `/${this.name}/`;
    }

    /**
     * 服务的名称
     */
    public get name() {
        return this._options.name ?? 'gez';
    }

    /**
     * 当前服务，生成一个全局唯一的变量名称
     */
    public get varName() {
        return '__' + this.name.replace(/[^a-zA-Z]/g, '_') + '__';
    }

    public get isProd(): boolean {
        return this._options?.isProd ?? process.env.NODE_ENV === 'production';
    }

    public get browserslist() {
        return ['chrome >=87', 'firefox >=78', 'safari >=14', 'edge >=88'];
    }

    public async init(command: COMMAND) {
        if (this._command) {
            throw new Error('Cannot be initialized repeatedly');
        }
        moduleLink(path.resolve(this.root, 'node_modules'), this.moduleConfig);
        const createDevApp = this._options.createDevApp || defaultCreateDevApp;

        this._command = command;
        const app: App =
            command === COMMAND.start
                ? await createApp(this)
                : await createDevApp(this);
        this._app = app;
    }

    public getProjectPath(projectPath: ProjectPath): string {
        return getProjectPath(this.root, projectPath);
    }
}

async function defaultCreateDevApp(): Promise<App> {
    throw new Error("'createDevApp' function not set");
}
