import { type RspackOptions, rspack } from '@rspack/core';
import { ImportmapPlugin } from '../importmap';
import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        const plugins: Config = [
            new ImportmapPlugin(gez.moduleConfig),
            new rspack.ProgressPlugin({
                prefix: `client:${gez.name}`
            })
        ];
        if (!gez.isProd) {
            plugins.push(new rspack.HotModuleReplacementPlugin());
        }
        return plugins;
    }

    protected getServer(): Config {
        const { gez } = this;
        return [
            new rspack.ProgressPlugin({
                prefix: `server:${gez.name}`
            }),
            new ImportmapPlugin(gez.moduleConfig)
        ];
    }

    protected getNode(): Config {
        const { gez } = this;
        return [
            new rspack.ProgressPlugin({
                prefix: `node:${gez.name}`
            })
        ];
    }
}
