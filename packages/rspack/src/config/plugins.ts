import { rspack, type RspackOptions } from '@rspack/core';

import { ImportmapPlugin } from '../importmap';
import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        const plugins: Config = [new ImportmapPlugin(gez.modules)];
        if (!gez.isProd) {
            plugins.push(new rspack.HotModuleReplacementPlugin());
        }
        return plugins;
    }

    protected getServer(): Config {
        const { gez } = this;
        return [new ImportmapPlugin(gez.modules)];
    }

    protected getNode(): Config {
        return [];
    }
}
