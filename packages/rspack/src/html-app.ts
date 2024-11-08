import type { Gez } from '@gez/core';
import { type SwcLoaderOptions, rspack } from '@rspack/core';
import { type RspackAppOptions, createRspackApp } from './app';

export interface RspackHtmlAppOptions extends RspackAppOptions {
    swcLoader?: SwcLoaderOptions;
    /**
     * 构建目标
     */
    target?: {
        /**
         * 浏览器的构建目标
         */
        web?: string[];
        /**
         * nodejs的构建目标
         */
        node?: string[];
    };
}
export async function createRspackHtmlApp(
    gez: Gez,
    options?: RspackHtmlAppOptions
) {
    options = {
        ...options,
        target: {
            web: ['chrome>=87', 'firefox>=78', 'safari>=14', 'edge>=88'],
            node: ['node>=20'],
            ...options?.target
        }
    };
    return createRspackApp(gez, {
        ...options,
        config(context) {
            const { config, buildTarget } = context;

            const isWebApp =
                buildTarget === 'client' || buildTarget === 'server';
            config.plugins = [
                ...(config.plugins ?? []),
                // CSS 抽离插件
                isWebApp
                    ? new rspack.CssExtractRspackPlugin({
                          filename: gez.isProd
                              ? `css/[name].[contenthash:8].css`
                              : `css/[name].css`
                      })
                    : false
            ];
            config.module = {
                ...config.module,
                rules: [
                    ...(config.module?.rules ?? []),
                    {
                        test: /\.css$/i,
                        use: [
                            rspack.CssExtractRspackPlugin.loader,
                            resolve('css-loader')
                        ],
                        type: 'javascript/auto'
                    },
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
                                        ? options?.target?.web
                                        : options?.target?.node,
                                ...options?.swcLoader?.env
                            },
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    decorators: true,
                                    ...options?.swcLoader?.jsc?.parser
                                },
                                ...options?.swcLoader?.jsc
                            },
                            ...options?.swcLoader
                        } satisfies SwcLoaderOptions,
                        type: 'javascript/auto'
                    }
                ]
            };
            options?.config?.(context);
        }
    });
}

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
function filename(gez: Gez, name: string) {
    return gez.isProd
        ? `${name}/[name].[contenthash:8][ext]`
        : `${name}/[path][name][ext]`;
}
