import type { Gez } from '@gez/core';
import type { RspackOptions } from '@rspack/core';

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
                test: /\.ts$/,
                loader: 'builtin:swc-loader',
                options: {
                    sourceMap: true,
                    jsc: {
                        parser: {
                            syntax: 'typescript'
                        }
                    }
                },
                type: 'javascript/auto'
            }
        ],
        defaultRules: []
    };
    return {
        name: gez.name,
        plugins: plugins.get(),
        module,
        resolve: {
            alias: {},
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
        cache: false,
        mode: gez.isProd ? 'production' : 'development'
    };
}
