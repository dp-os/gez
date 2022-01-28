import Config from 'webpack-chain';
import { BaseGenesis } from '../utils';
export class BaseConfig extends BaseGenesis {
    constructor(ssr, target) {
        super(ssr);
        const config = (this.config = new Config());
        config.mode(this.ssr.isProd ? 'production' : 'development');
        config.set('target', ssr.getBrowsers(target));
        config.output.publicPath(target == 'client' ? 'auto' : this.ssr.publicPath);
        config.resolve.extensions.add('.js');
        this.ready = this.ssr.plugin.callHook('chainWebpack', {
            target,
            config
        });
        config.output.pathinfo(false);
        config.stats('errors-warnings');
        const alias = ssr.options?.build?.alias;
        if (typeof alias === 'object') {
            Object.keys(alias).forEach((k) => {
                const v = alias[k];
                config.resolve.alias.set(k, v);
            });
        }
    }
    async toConfig() {
        await this.ready;
        return this.config.toConfig();
    }
}
