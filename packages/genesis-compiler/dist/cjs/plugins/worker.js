"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const utils_1 = require("../utils");
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
            filename: (0, utils_1.getFilename)(ssr, 'worker')
        });
    }
}
exports.WorkerPlugin = WorkerPlugin;
