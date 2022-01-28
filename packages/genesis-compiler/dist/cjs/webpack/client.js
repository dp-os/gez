"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConfig = void 0;
const base_1 = require("./base");
class ClientConfig extends base_1.BaseConfig {
    constructor(ssr) {
        super(ssr, 'client');
        const { config } = this;
        config
            .entry(ssr.entryName)
            .add(ssr.entryClientFile)
            .end()
            .output.set('uniqueName', ssr.name);
        config.output
            .path(ssr.outputDirInClient)
            .filename(ssr.isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js');
        config.devtool(false);
    }
}
exports.ClientConfig = ClientConfig;
