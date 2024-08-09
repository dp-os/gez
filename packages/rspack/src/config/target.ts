import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['target']>;

export class Target extends BuildConfig<Config> {
    protected getClient(): Config {
        return 'web';
    }

    protected getServer(): Config {
        return 'node20';
    }

    protected getNode(): Config {
        return 'node20';
    }
}
