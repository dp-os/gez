import { type RspackOptions, rspack } from '@rspack/core';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { ImportmapPlugin } from '../importmap';
import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        const plugins: Config = [
            this.getDefinePlugin(),
            this.getProgressPlugin(),
            new NodePolyfillPlugin(),
            new ImportmapPlugin(gez.moduleConfig)
        ];
        if (!gez.isProd) {
            plugins.push(new rspack.HotModuleReplacementPlugin());
        }
        return plugins;
    }

    protected getServer(): Config {
        const { gez } = this;
        return [
            this.getDefinePlugin(),
            this.getProgressPlugin(),
            new NodePolyfillPlugin(),
            new ImportmapPlugin(gez.moduleConfig)
        ];
    }

    protected getNode(): Config {
        return [
            this.getDefinePlugin(),
            this.getProgressPlugin(),
            new NodePolyfillPlugin()
        ];
    }
    private getProgressPlugin() {
        return new rspack.ProgressPlugin({
            prefix: this.target
        });
    }
    private getDefinePlugin() {
        const { gez, target } = this;
        return new rspack.DefinePlugin({
            'process.env.VUE_ENV': JSON.stringify(target),
            'process.env.GENESIS_NAME': JSON.stringify(gez.name)
        });
    }
}
