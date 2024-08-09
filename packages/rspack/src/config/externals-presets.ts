import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['externalsPresets']>;

export class ExternalsPresets extends BuildConfig<Config> {
    protected getClient(): Config {
        return {
            web: true
        };
    }

    protected getServer(): Config {
        return {
            node: true
        };
    }

    protected getNode(): Config {
        return {
            node: true
        };
    }
}
