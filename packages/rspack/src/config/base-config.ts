import type { BuildTarget, Gez } from '@gez/core';
import type { RspackOptions } from '@rspack/core';

import { Alias } from './alias';
import { Entry } from './entry';
import { Externals } from './externals';
import { ExternalsPresets } from './externals-presets';
import { Optimization } from './optimization';
import { Output } from './output';
import { Plugins } from './plugins';
import { createRules } from './rules';
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
    const emit = buildTarget === 'client';
    const module: RspackOptions['module'] = {
        parser: {
            javascript: {
                importMeta: false // 不对 import.meta 进行解析替换
            }
        },
        generator: {
            asset: {
                emit
            },
            'asset/resource': {
                emit
            }
        },
        rules: createRules(gez, buildTarget)
    };
    return {
        stats: 'errors-warnings',
        context: gez.root,
        name: gez.name,
        plugins: plugins.get(),
        module,
        resolve: {
            alias: alias.get(),
            extensions: ['.ts', '...']
        },
        optimization: {
            ...optimization.get()
        },
        externalsPresets: {
            ...externalsPresets.get()
        },
        externalsType: 'module-import',
        externals: externals.get(),
        entry: entry.get(),
        output: {
            publicPath:
                buildTarget === 'client'
                    ? undefined
                    : `${gez.dynamicBaseVar}${gez.base}`,
            uniqueName: gez.varName,
            hotUpdateChunkFilename: 'hot-update/[id].[fullhash].hot-update.js',
            ...output.get()
        },
        experiments: {
            css: true,
            outputModule: true
        },
        target: target.get(),
        ignoreWarnings: [],
        cache: !gez.isProd,
        devtool: false,
        mode: gez.isProd ? 'production' : 'development'
    };
}
