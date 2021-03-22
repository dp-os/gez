"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConfig = void 0;
const base_1 = require("./base");
const isCSS = (module) => {
    return (module.resource &&
        /node_modules/.test(module.resource) &&
        /\.(vue|css|less|sass|scss)$/.test(module.resource));
};
class ClientConfig extends base_1.BaseConfig {
    constructor(ssr) {
        super(ssr, 'client');
        this.config.entry('app').add(this.ssr.entryClientFile).end();
        this.config.output
            .path(this.ssr.outputDirInClient)
            .filename(this.ssr.isProd
            ? 'js/[name].[contenthash:8].js'
            : 'js/[name].js');
        this.config.optimization.splitChunks({
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    test: (module) => {
                        return isCSS(module);
                    }
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    priority: -25,
                    test: (module) => {
                        return !isCSS(module);
                    }
                }
            }
        });
        this.config.optimization.runtimeChunk({
            name: 'runtime'
        });
    }
    async toConfig() {
        const config = await super.toConfig();
        const name = `webpack_jsonp_${this.ssr.name.replace(/[^A-z]/g, '_')}`;
        config.output.chunkLoadingGlobal = name;
        return config;
    }
}
exports.ClientConfig = ClientConfig;
