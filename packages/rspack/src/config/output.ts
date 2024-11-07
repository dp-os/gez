import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['output']>;

export class Output extends BuildConfig<Config> {
    public getBase(): Config {
        const { gez } = this;
        return {
            clean: true,
            module: true,
            chunkFormat: gez.isProd ? 'module' : undefined,
            chunkLoading: gez.isProd ? 'import' : undefined,
            chunkFilename: 'js/[name].[contenthash:8].js',
            filename: gez.isProd ? '[name].[contenthash:8].js' : '[name].js',
            cssFilename: gez.isProd
                ? 'css/[name].[contenthash:8].css'
                : 'css/[name].css',
            cssChunkFilename: gez.isProd
                ? 'css/[name].[contenthash:8].css'
                : 'css/[name].css'
        };
    }
    protected getClient(): Config {
        const { gez } = this;
        return {
            ...this.getBase(),
            path: gez.getProjectPath('dist/client')
        };
    }

    protected getServer(): Config {
        const { gez } = this;
        return {
            ...this.getBase(),
            filename: '[name].js',
            path: gez.getProjectPath('dist/server')
        };
    }

    protected getNode(): Config {
        const { gez } = this;
        return {
            ...this.getBase(),
            filename: '[name].js',
            path: gez.getProjectPath('dist/node')
        };
    }
}
