import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['optimization']>;

export class Optimization extends BuildConfig<Config> {
    protected getClient(): Config {
        return {
            minimize: this.gez.isProd
        };
    }

    protected getServer(): Config {
        return {
            minimize: false
        };
    }

    protected getNode(): Config {
        return {
            minimize: false
        };
    }
}
