import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

function fixName(name: string) {
    return name.replace(/\W/g, '');
}

export class ModuleFederationPlugin extends Plugin {
    public chainWebpack({ config, target }: WebpackHookParams) {
        const { ssr } = this;
        const exposes: Record<string, string> = {};
        const entryName = this.ssr.exposesEntryName;
        const remotes: Record<string, string> = {};
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
                if (Array.isArray(data.remotes)) {
                    data.remotes
                        .map((item) => {
                            return {
                                name: item
                            };
                        })
                        .forEach((item) => {
                            remotes[item.name] = `${fixName(
                                item.name
                            )}@http://localhost:3001/${
                                item.name
                            }/js/${entryName}.js`;
                        });
                }
            } catch (e) {}
        }
        const name = fixName(ssr.name);

        config.plugin('module-federation').use(
            new webpack.container.ModuleFederationPlugin({
                name,
                filename: ssr.isProd
                    ? `js/${entryName}.[contenthash:8].js`
                    : `js/${entryName}.js`,
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
}
