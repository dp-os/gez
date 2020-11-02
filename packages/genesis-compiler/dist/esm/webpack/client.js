import { BaseConfig } from './base';
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
            cacheGroups: {
                default: {
                    name: 'common',
                    chunks: 'initial',
                    minChunks: 2,
                    priority: -20
                },
                vendors: {
                    test: /node_modules[\\/](vue|vue-loader|vue-router|vuex|vue-meta|vue-class-component|core-js|@babel\/runtime|axios|regenerator-runtime)[\\/]/,
                    chunks: 'initial',
                    name: 'vendors',
                    priority: -15
                }
            }
        });
        this.config.optimization.runtimeChunk({
            name: 'runtime'
        });
        this.config.output.jsonpFunction(`webpack_jsonp_${this.ssr.name.replace(/[^A-z]/g, '_')}`);
    }
}
