"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
class WorkerPlugin extends genesis_core_1.Plugin {
    chainWebpack({ config }) {
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
exports.WorkerPlugin = WorkerPlugin;
