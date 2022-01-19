import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';

export class WorkerPlugin extends Plugin {
    public chainWebpack({ config }: WebpackHookParams) {
        const { ssr } = this;
        config.module
            .rule('worker')
            .test(/\.worker\.(c|m)?(t|j)s$/i)
            .include.add(ssr.srcIncludes)
            .end()
            .use('worker')
            .loader('worker-loader')
            .options({
                esModule: false,
                filename: ssr.isProd
                    ? 'worker/[name].[contenthash:8].[ext]'
                    : 'worker/[path][name].[ext]'
            });
    }
}
