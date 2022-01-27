"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfig = void 0;
const base_1 = require("./base");
class ServerConfig extends base_1.BaseConfig {
    constructor(ssr) {
        super(ssr, 'server');
        this.config.entry('app').add(this.ssr.entryServerFile).end();
        this.config.output
            .path(this.ssr.outputDirInServer)
            .filename('js/[name].js');
        this.config.devtool(false);
        this.config.output.libraryTarget('commonjs2');
        this.config.module.set('parser', {
            javascript: {
                url: 'relative'
            }
        });
        this.config.optimization.minimize(false);
    }
}
exports.ServerConfig = ServerConfig;
