import webpack from 'webpack';
import Config from 'webpack-chain';
import fs from 'fs';
import path from 'path';
import { BaseGenesis } from '../utils';
export class BaseConfig extends BaseGenesis {
    constructor(ssr, target) {
        super(ssr);
        const config = this.config = new Config();
        config.mode(this.ssr.isProd ? 'production' : 'development');
        config.set('target', ssr.getBrowsers(target));
        config.output.publicPath(this.ssr.publicPath);
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
        let exposes = {};
        let remotes = {};
        if (fs.existsSync(ssr.mfConfigFile)) {
            const text = fs.readFileSync(ssr.mfConfigFile, 'utf-8');
            try {
                const data = JSON.parse(text);
                if ('exposes' in data) {
                    Object.keys(data.exposes).forEach(key => {
                        const filename = data.exposes[key];
                        const fullPath = path.resolve(ssr.srcDir, filename);
                        exposes[key] = fullPath;
                    });
                }
                if ('remotes' in data) {
                    remotes = data.remotes;
                }
            }
            catch (e) { }
        }
        config.plugin('module-federation').use(new webpack.container.ModuleFederationPlugin({
            name: ssr.name.replace(/\W/g, ''),
            filename: 'js/exposes.js',
            exposes,
            remotes,
            remoteType: target === 'client' ? 'window' : 'commonjs-module',
            shared: {
                'vue': {
                    singleton: true
                }
            }
        }));
    }
    async toConfig() {
        await this.ready;
        return this.config.toConfig();
    }
}
