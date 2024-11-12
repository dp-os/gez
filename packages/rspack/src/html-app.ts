import type { Gez } from '@gez/core';
import { type RuleSetUse, type SwcLoaderOptions, rspack } from '@rspack/core';
import {
    type RspackAppConfigContext,
    type RspackAppOptions,
    createRspackApp
} from './app';

export interface RspackHtmlAppOptions extends RspackAppOptions {
    /**
     * 是否启用相关的 CSS 规则，默认为 true。
     */
    css?: boolean;
    /**
     * 透传 https://github.com/webpack-contrib/less-loader
     */
    lessLoader?: Record<string, any>;
    /**
     * 透传 https://github.com/yenshih/style-resources-loader
     */
    styleResourcesLoader?: Record<string, any>;
    /**
     * 透传 https://rspack.dev/guide/features/builtin-swc-loader
     */
    swcLoader?: SwcLoaderOptions;

    /**
     * 透传 DefinePlugin 的值 https://rspack.dev/plugins/webpack/define-plugin
     */
    definePlugin?: Record<string, string>;

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
            config.stats = 'errors-warnings';
            config.module = {
                ...config.module,
                rules: [
                    ...(config.module?.rules ?? []),
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
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        type: 'asset/resource',
                        generator: {
                            filename: filename(gez, 'fonts')
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
            config.optimization = {
                ...config.optimization,
                minimizer: [
                    new rspack.SwcJsMinimizerRspackPlugin({
                        minimizerOptions: {
                            format: {
                                comments: false
                            }
                        }
                    }),
                    new rspack.LightningCssMinimizerRspackPlugin({
                        minimizerOptions: {
                            errorRecovery: false
                        }
                    })
                ]
            };
            config.plugins = config.plugins ?? [];
            config.devtool = false;
            config.cache = false;
            if (options.definePlugin) {
                config.plugins.push(
                    new rspack.DefinePlugin(options.definePlugin)
                );
            }
            addCssConfig(options, context);
            options?.config?.(context);
        }
    });
}

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
function filename(gez: Gez, name: string) {
    return gez.isProd
        ? `${name}/[name].[contenthash:8].final[ext]`
        : `${name}/[path][name][ext]`;
}

function addCssConfig(
    options: RspackHtmlAppOptions,
    { config }: RspackAppConfigContext
) {
    // 启用 CSS
    config.experiments = {
        ...config.experiments,
        css: options.css !== false
    };
    if (!config.experiments.css) {
        return;
    }
    const lessLoaders: RuleSetUse = [
        {
            loader: resolve('less-loader'),
            options: options.lessLoader
        }
    ];
    if (options.styleResourcesLoader) {
        lessLoaders.push({
            loader: resolve('style-resources-loader'),
            options: options.styleResourcesLoader
        });
    }
    config.module = {
        ...config.module,
        rules: [
            ...(config.module?.rules ?? []),
            {
                test: /\.less$/,
                use: [...lessLoaders],
                type: 'css'
            }
        ]
    };
}
