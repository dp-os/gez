import Genesis from '@fmfe/genesis-core';

import { BaseConfig } from './base';

const isCSS = (module: any) => {
    return (
        module.resource &&
        /node_modules/.test(module.resource) &&
        /\.(vue|css|less|sass|scss)$/.test(module.resource)
    );
};

export class ClientConfig extends BaseConfig {
    public constructor(ssr: Genesis.SSR) {
        super(ssr, 'client');
        this.config.entry('app').add(this.ssr.entryClientFile).end();
        this.config.output
            .path(this.ssr.outputDirInClient)
            .filename(
                this.ssr.isProd
                    ? 'js/[name].[contenthash:8].js'
                    : 'js/[name].js'
            );
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
                    test: (module: any) => {
                        return isCSS(module);
                    }
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    priority: -25,
                    test: (module: any) => {
                        return !isCSS(module);
                    }
                }
            }
        });
        this.config.optimization.runtimeChunk({
            name: 'runtime'
        });
        this.config.output.jsonpFunction(
            `webpack_jsonp_${this.ssr.name.replace(/[^A-z]/g, '_')}`
        );
    }
}
