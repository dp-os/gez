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
            .end();
        this.config.output
            .path(this.ssr.outputDirInClient)
            .filename(this.ssr.isProd
            ? 'js/[name].[contenthash:8].js'
            : 'js/[name].js');
        this.config.optimization.splitChunks(false);
        this.config.optimization.runtimeChunk({
            name: 'runtime'
        });
        this.config.output.jsonpFunction(`webpack_jsonp_${this.ssr.name.replace(/[^A-z]/g, '_')}`);
    }
}
exports.ClientConfig = ClientConfig;
