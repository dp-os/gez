import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['resolve']>['alias'];

export class Alias extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        return {
            [gez.name]: gez.root
        };
    }

    protected getServer(): Config {
        const { gez } = this;
        return {
            [gez.name]: gez.root
        };
    }

    protected getNode(): Config {
        const { gez } = this;
        return {
            [gez.name]: gez.root
        };
    }
}
