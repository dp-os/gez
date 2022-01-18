"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConfig = void 0;
const base_1 = require("./base");
class ClientConfig extends base_1.BaseConfig {
    constructor(ssr) {
        super(ssr, 'client');
        this.config
            .entry('app')
            .add(this.ssr.entryClientFile)
            .end()
            .output.set('uniqueName', this.ssr.name);
        this.config.output
            .path(this.ssr.outputDirInClient)
            .filename(this.ssr.isProd
            ? 'js/[name].[contenthash:8].js'
            : 'js/[name].js');
        this.config.optimization.splitChunks({
            chunks: 'all'
        });
        this.config.optimization.runtimeChunk({
            name: 'runtime'
        });
    }
}
exports.ClientConfig = ClientConfig;
