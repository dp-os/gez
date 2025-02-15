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
import { getImportPreloadInfo } from './static-import-lexer';

export interface GezOptions {
    root?: string;
    isProd?: boolean;
    basePathPlaceholder?: string | false;
    modules?: ModuleConfig;
    packs?: PackConfig;
    createDevApp?: (gez: Gez) => Promise<App>;
    createServer?: (gez: Gez) => Promise<void>;
    postCompileProdHook?: (gez: Gez) => Promise<void>;
}

export type AppBuildTarget = 'client' | 'server';

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
    private readonly _options: GezOptions;
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

    public async createServer(): Promise<void> {
        await this._options?.createServer?.(this);
    }

    public async postCompileProdHook(): Promise<boolean> {
        try {
            await this._options.postCompileProdHook?.(this);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

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

        const createDevApp = this._options.createDevApp || defaultCreateDevApp;
        const app: App = [COMMAND.dev, COMMAND.build].includes(command)
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

    public get middleware() {
        return this.readied.app.middleware;
    }

    public get render() {
        return this.readied.app.render;
    }

    public resolvePath(projectPath: ProjectPath, ...args: string[]): string {
        return resolvePath(this.root, projectPath, ...args);
    }

    public writeSync(filepath: string, data: any): void {
        write.sync(filepath, data);
    }

    public async write(filepath: string, data: any): Promise<void> {
        await write(filepath, data);
    }

    public readJsonSync(filename: string): any {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    }

    public async readJson(filename: string): Promise<any> {
        return JSON.parse(await fsp.readFile(filename, 'utf-8'));
    }

    public async getManifestList(
        target: AppBuildTarget
    ): Promise<readonly ManifestJson[]> {
        return this.readied.cache(`getManifestList-${target}`, async () =>
            Object.freeze(await getManifestList(target, this.moduleConfig))
        );
    }

    public async getImportMap(
        target: AppBuildTarget,
        withoutIndex = true
    ): Promise<Readonly<ImportMap>> {
        return this.readied.cache(
            `getImportMap-${target}-${withoutIndex}`,
            async () =>
                Object.freeze(
                    getImportMap(
                        target,
                        withoutIndex,
                        await this.getManifestList(target),
                        this.moduleConfig
                    )
                )
        );
    }

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
