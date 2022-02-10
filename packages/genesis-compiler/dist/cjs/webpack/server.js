"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfig = void 0;
const base_1 = require("./base");
class ServerConfig extends base_1.BaseConfig {
    constructor(ssr) {
        super(ssr, 'server');
        const { config } = this;
        config.entry(ssr.entryName).add(ssr.entryServerFile).end();
        config.output
            .path(ssr.outputDirInServer)
            .filename('js/[name].js');
        config.devtool(false);
        config.output.libraryTarget('commonjs2');
        config.module.set('parser', {
            javascript: {
                url: 'relative'
            }
        });
    }
}
exports.ServerConfig = ServerConfig;
