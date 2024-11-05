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

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}

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
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: filename(gez, 'images')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
                type: 'asset/resource',
                generator: {
                    filename: filename(gez, 'media')
                }
            },
            {
                test: /\.json$/i,
                type: 'json'
            },
            {
                test: /\.worker\.(c|m)?(t|j)s$/i,
                loader: resolve('worker-rspack-loader'),
                options: {
                    esModule: false,
                    filename: filename(gez, 'worker')
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: filename(gez, 'fonts')
                }
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
            extensions: ['.ts', '...']
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

function filename(gez: Gez, name: string) {
    return gez.isProd
        ? `${name}/[name].[contenthash:8][ext]`
        : `${name}/[path][name][ext]`;
}
