import path from 'node:path';
import { cwd } from 'node:process';

import { type App } from './app';
import { getProjectPath, type ProjectPath } from './project-path';

export interface FederationSharedConfig {
    import?: boolean;
    shareScope?: string;
    version?: string;
    requiredVersion?: string;
}

export type FederationShared = Array<
    Record<string, FederationSharedConfig> | string
>;

export interface Federation {
    exposes?: string[];
    shared?: FederationShared;
    shareScope?: string;
}

export interface GezOptions {
    root?: string;
    name?: string;
    isProd?: boolean;
    federation?: Federation;
    createDevApp?: (gez: Gez) => Promise<App>;
}

export enum COMMAND {
    dev = 'dev',
    build = 'build',
    preview = 'preview',
    start = 'start'
}

export class Gez {
    private readonly _options: GezOptions;
    private _app: App | null = null;
    private _command: COMMAND | null = null;
    public constructor(options: GezOptions = {}) {
        this._options = options;
    }

    public get app() {
        const { _app } = this;
        if (_app) {
            return _app;
        }
        throw new Error(`'app' does not exist`);
    }

    public set app(app: App) {
        if (this._app) {
            throw new Error(`'app' cannot be set`);
        }
        this._app = app;
    }

    public get command() {
        const { _command } = this;
        if (_command) {
            return _command;
        }
        throw new Error(`'command' does not exist`);
    }

    public set command(command: COMMAND) {
        if (this._command) {
            throw new Error(`'command' cannot be set`);
        }
        this._command = command;
    }

    public get build() {
        return this.app.build;
    }

    public get middleware() {
        return this.app.middleware;
    }

    public get render() {
        return this.app.render;
    }

    public async destroy() {
        const { _app } = this;
        if (_app) {
            _app.destroy();
        }
    }

    public get root(): string {
        const { root = cwd() } = this._options;
        if (path.isAbsolute(root)) {
            return root;
        }
        return path.resolve(cwd(), root);
    }

    public get base() {
        return `/${this.name}/`;
    }

    public get name() {
        return this._options.name ?? 'gez';
    }

    public get isProd(): boolean {
        return this._options?.isProd ?? process.env.NODE_ENV === 'production';
    }

    public get federation() {
        return this._options.federation ?? null;
    }

    public get createDevApp(): GezOptions['createDevApp'] {
        return this._options.createDevApp;
    }

    public getProjectPath(projectPath: ProjectPath): string {
        return getProjectPath(this.root, projectPath);
    }
}
