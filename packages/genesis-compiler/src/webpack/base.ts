import Config from 'webpack-chain';
import webpack from 'webpack';
import Genesis from '@fmfe/genesis-core';
import { BaseGenesis } from '../utils';

export class BaseConfig extends BaseGenesis {
    public config: Config;
    public reday: Promise<void>;
    public constructor(ssr: Genesis.SSR, target: Genesis.WebpackBuildTarget) {
        super(ssr);
        this.config = new Config();
        this.config.mode(this.ssr.isProd ? 'production' : 'development');
        this.config.output.publicPath(this.ssr.publicPath);
        this.config.resolve.extensions.add('.js');
        this.reday = this.ssr.plugin.callHook('webpackConfig', {
            target: target,
            config: this.config
        });
        const alias = ssr.options?.build?.alias;
        if (typeof alias === 'object') {
            Object.keys(alias).forEach((k) => {
                const v = alias[k];
                this.config.resolve.alias.set(k, v);
            });
        }
    }

    public async toConfig(): webpack.Configuration {
        await this.reday;
        return this.config.toConfig();
    }
}
