import { Plugin } from '@fmfe/genesis-core';
export class WorkerPlugin extends Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('worker')
            .test(/\.worker\.(c|m)?(t|j)s$/i)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('worker')
            .loader('worker-loader')
            .options({
            esModule: false,
            filename: this.ssr.isProd
                ? 'worker/[name].[contenthash:8].[ext]'
                : 'worker/[path][name].[ext]'
        });
    }
}
