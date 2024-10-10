import { rspack, type RspackOptions } from '@rspack/core';

import { ImportmapPlugin } from '../importmap';
import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    protected getClient(): Config {
        const {
            gez: { root, modules, isProd }
        } = this;
        const plugins: Config = [
            new ImportmapPlugin({
                root,
                modules
            })
        ];
        if (!isProd) {
            plugins.push(new rspack.HotModuleReplacementPlugin());
        }
        return plugins;
    }

    protected getServer(): Config {
        const {
            gez: { root, modules }
        } = this;
        return [
            new ImportmapPlugin({
                root,
                modules
            })
        ];
    }

    protected getNode(): Config {
        return [];
    }
}
