import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['output']>;

export class Output extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        return {
            clean: gez.isProd,
            module: true,
            chunkFormat: gez.isProd ? 'module' : undefined,
            chunkLoading: gez.isProd ? 'import' : undefined,
            chunkFilename: 'chunks/[name].[contenthash:8].js',
            filename: gez.isProd ? '[name].[contenthash:8].js' : '[name].js',
            path: gez.getProjectPath('dist/client')
        };
    }

    protected getServer(): Config {
        const { gez } = this;
        return {
            clean: gez.isProd,
            module: true,
            chunkFormat: 'module',
            chunkLoading: 'import',
            chunkFilename: 'chunks/[name].[contenthash:8].js',
            filename: '[name].js',
            path: gez.getProjectPath('dist/server')
        };
    }

    protected getNode(): Config {
        const { gez } = this;
        return {
            clean: gez.isProd,
            module: true,
            chunkFormat: 'module',
            chunkLoading: 'import',
            chunkFilename: 'chunks/[name].[contenthash:8].js',
            filename: '[name].js',
            path: gez.getProjectPath('dist/node')
        };
    }
}
