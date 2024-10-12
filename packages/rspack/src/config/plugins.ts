import { type RspackOptions, rspack } from '@rspack/core';
import { ImportmapPlugin } from '../importmap';
import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    protected getClient(): Config {
        const {
            gez: { isProd, moduleConfig }
        } = this;
        const plugins: Config = [new ImportmapPlugin(moduleConfig)];
        if (!isProd) {
            plugins.push(new rspack.HotModuleReplacementPlugin());
        }
        return plugins;
    }

    protected getServer(): Config {
        const {
            gez: { moduleConfig }
        } = this;
        return [new ImportmapPlugin(moduleConfig)];
    }

    protected getNode(): Config {
        return [];
    }
}
