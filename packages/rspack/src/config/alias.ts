import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['resolve']>['alias'];

export class Alias extends BuildConfig<Config> {
    public getBase(): Config {
        const { gez } = this;
        return {
            [gez.name]: gez.root
        };
    }
    protected getClient(): Config {
        return this.getBase();
    }

    protected getServer(): Config {
        return this.getBase();
    }

    protected getNode(): Config {
        return this.getBase();
    }
}
