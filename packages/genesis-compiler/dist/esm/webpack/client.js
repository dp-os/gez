import { BaseConfig } from './base';
const isCSS = (module) => {
    return (module.resource &&
        /node_modules/.test(module.resource) &&
        /\.(vue|css|less|sass|scss)$/.test(module.resource));
};
export class ClientConfig extends BaseConfig {
    constructor(ssr) {
        super(ssr, 'client');
        this.config.entry('app').add(this.ssr.entryClientFile).end();
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
    async toConfig() {
        const config = await super.toConfig();
        const name = `webpack_jsonp_${this.ssr.name.replace(/[^A-z]/g, '_')}`;
        config.output.chunkLoadingGlobal = name;
        return config;
    }
}
