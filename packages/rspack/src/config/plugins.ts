import { moduleLinkPlugin } from '@gez/rspack-module-link';
import { type RspackOptions, rspack } from '@rspack/core';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    public getBase(): Config {
        const { gez } = this;
        return [
            new rspack.CssExtractRspackPlugin({
                filename: gez.isProd
                    ? `css/[name].[contenthash:8].css`
                    : `css/[name].css`
            }),
            this.getProgressPlugin(),
            moduleLinkPlugin(gez.moduleConfig)
        ];
    }
    protected getClient(): Config {
        const { gez } = this;
        const plugins: Config = [...this.getBase(), new NodePolyfillPlugin()];
        if (!gez.isProd) {
            plugins.push(new rspack.HotModuleReplacementPlugin());
        }
        return plugins;
    }

    protected getServer(): Config {
        return [...this.getBase()];
    }

    protected getNode(): Config {
        return [this.getProgressPlugin()];
    }
    private getProgressPlugin() {
        return new rspack.ProgressPlugin({
            prefix: this.target
        });
    }
}
