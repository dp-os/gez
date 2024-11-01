import type { RspackOptions } from '@rspack/core';
import nodeExternals from 'webpack-node-externals';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['externals']>;

export class Externals extends BuildConfig<Config> {
    protected getClient(): Config {
        return [];
    }

    protected getServer(): Config {
        return [];
    }

    protected getNode(): Config {
        return [
            nodeExternals({
                importType: 'module-import' as any
            }) as any
        ];
    }
}
