import type { Gez } from '@gez/core';
import {
    type LightningcssLoaderOptions,
    type RuleSetConditions,
    type RuleSetUse,
    type SwcLoaderOptions,
    rspack
} from '@rspack/core';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import {
    type RspackAppConfigContext,
    type RspackAppOptions,
    createRspackApp
} from './app';
import type { BuildTarget } from './build-target';
import { RSPACK_LOADER } from './loader';

export interface RspackHtmlAppOptions extends RspackAppOptions {
    /**
     * CSS 输出到 css 文件还是 js 文件中，默认为 css，设置 为 false，则关闭 css 相关的 loader 规则，需要你手动配置。
     */
    css?: 'css' | 'js' | false;
    /**
     * 你可以选择重写一部分 loader 的。比如把 style-loader 替换成 new URL(import.meta.resolve('vue-style-loader')).pathname
     */
    loaders?: Partial<Record<keyof typeof RSPACK_LOADER, string>>;
    /**
     * 透传 https://github.com/webpack-contrib/style-loader
     */
    styleLoader?: Record<string, any>;
    /**
     * 透传 https://github.com/webpack-contrib/css-loader
     */
    cssLoader?: Record<string, any>;
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
    definePlugin?: Record<
        string,
        string | Partial<Record<BuildTarget, string>>
    >;

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
    /**
     * 有些 node_modules 的模块，你可能需要打包，就可以在这里配置规则。
     */
    transpile?: RuleSetConditions;
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
            const include = [
                gez.resolvePath('src'),
                ...(options.transpile ?? [])
            ];
            config.stats = 'errors-warnings';
            config.module = {
                ...config.module,
                rules: [
                    ...(config.module?.rules ?? []),
                    {
                        test: /\.(jpe?g|png|gif|bmp|webp|svg)$/i,
                        type: 'asset/resource',
                        include,
                        generator: {
                            filename: filename(gez, 'images')
                        }
                    },
                    {
                        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
                        type: 'asset/resource',
                        include,
                        generator: {
                            filename: filename(gez, 'media')
                        }
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/i,
                        type: 'asset/resource',
                        include,
                        generator: {
                            filename: filename(gez, 'fonts')
                        }
                    },
                    {
                        test: /\.json$/i,
                        include,
                        type: 'json'
                    },
                    {
                        test: /\.worker\.(c|m)?(t|j)s$/i,
                        include,
                        loader:
                            options.loaders?.workerRspackLoader ??
                            RSPACK_LOADER.workerRspackLoader,
                        options: {
                            esModule: false,
                            filename: filename(gez, 'worker')
                        }
                    },
                    {
                        test: /\.ts$/i,
                        include,
                        loader:
                            options.loaders?.builtinSwcLoader ??
                            RSPACK_LOADER.builtinSwcLoader,
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
            config.plugins = [
                new NodePolyfillPlugin(),
                ...(config.plugins ?? [])
            ];
            config.devtool = false;
            config.cache = false;
            if (options.definePlugin) {
                const defineOptions: Record<string, string> = {};
                Object.entries(options.definePlugin).forEach(
                    ([name, value]) => {
                        const targetValue =
                            typeof value === 'string'
                                ? value
                                : value[buildTarget];
                        if (typeof targetValue === 'string') {
                            defineOptions[name] = targetValue;
                        }
                    }
                );
                if (Object.keys(defineOptions).length) {
                    config.plugins.push(new rspack.DefinePlugin(defineOptions));
                }
            }
            config.resolve = {
                ...config.resolve,
                extensions: ['...', '.ts']
            };
            addCssConfig(gez, options, context);
            options?.config?.(context);
        }
    });
}

function filename(gez: Gez, name: string) {
    return gez.isProd
        ? `${name}/[name].[contenthash:8].final[ext]`
        : `${name}/[path][name][ext]`;
}

function addCssConfig(
    gez: Gez,
    options: RspackHtmlAppOptions,
    { config }: RspackAppConfigContext
) {
    if (options.css === false) {
        return;
    }
    const include = [gez.resolvePath('src'), ...(options.transpile ?? [])];
    // 输出在 .js 文件中
    if (options.css === 'js') {
        const cssRule: RuleSetUse = [
            {
                loader:
                    options.loaders?.styleLoader ?? RSPACK_LOADER.styleLoader,
                options: options.styleLoader
            },
            {
                loader: options.loaders?.cssLoader ?? RSPACK_LOADER.cssLoader,
                options: options.cssLoader
            },
            {
                loader:
                    options.loaders?.lightningcssLoader ??
                    RSPACK_LOADER.lightningcssLoader,
                options: {
                    targets: options.target?.web ?? [],
                    minify: gez.isProd
                } satisfies LightningcssLoaderOptions
            }
        ];
        const lessRule: RuleSetUse = [
            {
                loader: options.loaders?.lessLoader ?? RSPACK_LOADER.lessLoader,
                options: options.swcLoader
            }
        ];
        if (options.styleResourcesLoader) {
            lessRule.push({
                loader:
                    options.loaders?.styleResourcesLoader ??
                    RSPACK_LOADER.styleResourcesLoader,
                options: options.styleResourcesLoader
            });
        }
        config.module = {
            ...config.module,
            rules: [
                ...(config.module?.rules ?? []),
                {
                    test: /\.less$/,
                    include,
                    use: [...cssRule, ...lessRule],
                    type: 'javascript/auto'
                },
                {
                    test: /\.css$/,
                    include,
                    use: cssRule,
                    type: 'javascript/auto'
                }
            ]
        };
        return;
    }
    // 输出在 .css 文件中
    config.experiments = {
        ...config.experiments,
        css: true
    };
    if (!config.experiments.css) {
        return;
    }
    const lessLoaders: RuleSetUse = [
        {
            loader: options.loaders?.lessLoader ?? RSPACK_LOADER.lessLoader,
            options: options.lessLoader
        }
    ];
    if (options.styleResourcesLoader) {
        lessLoaders.push({
            loader:
                options.loaders?.styleResourcesLoader ??
                RSPACK_LOADER.styleResourcesLoader,
            options: options.styleResourcesLoader
        });
    }
    config.module = {
        ...config.module,
        rules: [
            ...(config.module?.rules ?? []),
            {
                test: /\.less$/,
                include,
                use: [...lessLoaders],
                type: 'css'
            }
        ]
    };
}
