import Genesis from '@fmfe/genesis-core';
import fs from 'fs';
import path from 'path';
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
        config.set('target', ssr.getBrowsers(target));
        config.output.publicPath(
            target == 'client' ? 'auto' : this.ssr.publicPath
        );
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
        const exposes: Record<string, string> = {};
        let remotes: Record<string, string> = {};
        if (fs.existsSync(ssr.mfConfigFile)) {
            const text = fs.readFileSync(ssr.mfConfigFile, 'utf-8');
            try {
                const data: Record<string, any> = JSON.parse(text);
                if ('exposes' in data) {
                    Object.keys(data.exposes).forEach((key) => {
                        const filename = data.exposes[key];
                        const fullPath = path.resolve(ssr.srcDir, filename);
                        exposes[key] = fullPath;
                    });
                }
                if ('remotes' in data) {
                    remotes = data.remotes;
                }
            } catch (e) {}
        }
        const name = ssr.name.replace(/\W/g, '');
        config.plugin('module-federation').use(
            new webpack.container.ModuleFederationPlugin({
                name,
                filename: 'js/exposes.js',
                exposes,
                remotes,
                shared: {
                    vue: {
                        singleton: true
                    },
                    'vue-router': {
                        singleton: true
                    }
                }
            })
        );
    }

    public async toConfig(): Promise<webpack.Configuration> {
        await this.ready;
        return this.config.toConfig();
    }
}
