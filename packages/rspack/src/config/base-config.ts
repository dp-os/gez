import type { Gez } from '@gez/core';
import type { RspackOptions, SwcLoaderOptions } from '@rspack/core';

import { Alias } from './alias';
import type { BuildTarget } from './base';
import { Entry } from './entry';
import { Externals } from './externals';
import { ExternalsPresets } from './externals-presets';
import { Optimization } from './optimization';
import { Output } from './output';
import { Plugins } from './plugins';
import { Target } from './target';

export function createBaseConfig(
    gez: Gez,
    buildTarget: BuildTarget
): RspackOptions {
    const entry = new Entry(gez, buildTarget);
    const output = new Output(gez, buildTarget);
    const alias = new Alias(gez, buildTarget);
    const target = new Target(gez, buildTarget);
    const optimization = new Optimization(gez, buildTarget);
    const externalsPresets = new ExternalsPresets(gez, buildTarget);
    const externals = new Externals(gez, buildTarget);
    const plugins = new Plugins(gez, buildTarget);
    const module: RspackOptions['module'] = {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.json$/i,
                type: 'json'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource'
            },
            {
                test: /\.ts$/,
                loader: 'builtin:swc-loader',
                options: {
                    env: {
                        targets:
                            buildTarget === 'client'
                                ? gez.browserslist
                                : [...gez.browserslist, 'node >= 20']
                    },
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            decorators: true
                        }
                    }
                } satisfies SwcLoaderOptions,
                type: 'javascript/auto'
            }
        ]
    };
    return {
        stats: 'errors-warnings',
        context: gez.root,
        name: gez.name,
        plugins: plugins.get(),
        module,
        resolve: {
            alias: alias.get(),
            extensions: []
        },
        optimization: {
            ...optimization.get()
        },
        externalsPresets: {
            ...externalsPresets.get()
        },
        externalsType: 'module',
        externals: externals.get(),
        entry: entry.get(),
        output: {
            publicPath: gez.base,
            uniqueName: gez.varName,
            ...output.get()
        },
        experiments: {
            outputModule: true
        },
        target: target.get(),
        ignoreWarnings: [],
        cache: !gez.isProd,
        devtool: false,
        mode: gez.isProd ? 'production' : 'development'
    };
}
