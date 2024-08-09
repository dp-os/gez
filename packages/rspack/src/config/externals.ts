import { builtinModules } from 'node:module';

import type { RspackOptions } from '@rspack/core';
import nodeExternals from 'webpack-node-externals';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['externals']>;

export class Externals extends BuildConfig<Config> {
    protected getClient(): Config {
        return [];
    }

    protected getServer(): Config {
        return [
            '@gez/core',
            nodeExternals({
                importType: 'module'
            }) as any
            // nodeFullModule()
        ];
    }

    protected getNode(): Config {
        return [
            nodeExternals({
                importType: 'module'
            }) as any
            // nodeFullModule()
        ];
    }
}

// function nodeFullModule(): Record<string, string> {
//     const externals: Record<string, string> = {};
//     builtinModules
//         .filter((x) => !/^_|^sys$/.test(x))
//         .forEach((name) => {
//             externals[name] = name;
//             externals[`node:${name}`] = `node:${name}`;
//         });
//     return externals;
// }
