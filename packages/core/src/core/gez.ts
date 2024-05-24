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

export class Gez {
    private readonly _options: GezOptions;
    private _app: App | null = null;
    public constructor(options: GezOptions = {}) {
        this._options = options;
    }

    public get app() {
        const { _app } = this;
        if (_app) {
            return _app;
        }
        throw new Error('App instance does not exist');
    }

    public set app(app: App) {
        if (this._app) {
            throw new Error('Cannot repeatedly mount App instances');
        }
        this._app = app;
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
