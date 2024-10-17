import { type RspackOptions, rspack } from '@rspack/core';
import { ImportmapPlugin } from '../importmap';
import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        const plugins: Config = [
            this.getProgressPlugin(),
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
            this.getProgressPlugin(),
            new ImportmapPlugin(gez.moduleConfig)
        ];
    }

    protected getNode(): Config {
        return [this.getProgressPlugin()];
    }
    private getProgressPlugin() {
        return new rspack.ProgressPlugin({
            prefix: `${this.target}: ${this.get.name}`
        });
    }
}
