import Genesis from '@fmfe/genesis-core';
import webpack from 'webpack';
import Config from 'webpack-chain';

import { BaseGenesis } from '../utils';

export class BaseConfig extends BaseGenesis {
    public config: Config;
    public ready: Promise<void>;
    public constructor(ssr: Genesis.SSR, target: Genesis.WebpackBuildTarget) {
        super(ssr);
        const config = (this.config = new Config());
        config.mode(this.ssr.isProd ? 'production' : 'development');
        config.set('target', ssr.getBuildTarget(target));
        config.output.publicPath(
            target === 'client' ? 'auto' : this.ssr.publicPath
        );
        config.resolve.extensions.add('.js');
        this.ready = this.ssr.plugin.callHook('chainWebpack', {
            target,
            config
        });
        config.output.pathinfo(false);
        config.stats('errors-warnings');
        const alias = ssr.options?.build?.alias || {};
        const fallback = ssr.options?.build?.fallback || {};
        config.resolve.set('fallback', fallback);
        Object.entries(alias).forEach(([key, value]) => {
            config.resolve.alias.set(key, value as string);
        });
    }

    public async toConfig(): Promise<webpack.Configuration> {
        await this.ready;
        return this.config.toConfig();
    }
}
