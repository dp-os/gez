import type { BuildTarget, Gez } from '@gez/core';
import type { RuleSetRules, SwcLoaderOptions } from '@rspack/core';

export function createRules(gez: Gez, buildTarget: BuildTarget): RuleSetRules {
    return [
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
    ];
}

function filename(gez: Gez, name: string) {
    return gez.isProd
        ? `${name}/[name].[contenthash:8][ext]`
        : `${name}/[path][name][ext]`;
}

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
