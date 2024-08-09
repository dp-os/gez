import { BuildConfig } from './base';

interface OutputConfig {
    module: true;
    filename: string;
    path?: string;
}

export class Output extends BuildConfig<OutputConfig> {
    protected getClient(): OutputConfig {
        const { gez } = this;
        return {
            module: true,
            // TODO: 生产模式应该启用
            // chunkFormat: 'module',
            // chunkLoading: 'import',
            filename: gez.isProd
                ? 'js/[name].[contenthash:8].js'
                : 'js/[name].js',
            path: gez.getProjectPath('dist/client')
        };
    }

    protected getServer(): OutputConfig {
        const { gez } = this;
        return {
            module: true,
            filename: gez.getProjectPath('dist/server/entry-server.js')
        };
    }

    protected getNode(): OutputConfig {
        const { gez } = this;
        return {
            module: true,
            filename: gez.getProjectPath('dist/node/entry-node.js')
        };
    }
}
