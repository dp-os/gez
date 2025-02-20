import type { Gez } from '@gez/core';
import {
    type LightningcssLoaderOptions,
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

/**
 * Rspack HTML 应用配置选项接口
 *
 * @example
 * ```ts
 * // entry.node.ts
 * export default {
 *   async devApp(gez) {
 *     return import('@gez/rspack').then((m) =>
 *       m.createRspackHtmlApp(gez, {
 *         // 将 CSS 输出到独立的 CSS 文件中
 *         css: 'css',
 *         // 自定义 loader
 *         loaders: {
 *           styleLoader: 'vue-style-loader'
 *         },
 *         // 配置 CSS 相关 loader
 *         styleLoader: {
 *           injectType: 'singletonStyleTag'
 *         },
 *         cssLoader: {
 *           modules: true
 *         },
 *         // 配置构建目标
 *         target: {
 *           web: ['chrome>=87'],
 *           node: ['node>=16']
 *         },
 *         // 定义全局常量
 *         definePlugin: {
 *           'process.env.APP_ENV': JSON.stringify('production')
 *         }
 *       })
 *     );
 *   }
 * };
 * ```
 */
export interface RspackHtmlAppOptions extends RspackAppOptions {
    /**
     * CSS 输出模式配置
     *
     * @default 'css'
     *
     * - 'css': 将 CSS 输出到独立的 CSS 文件中
     * - 'js': 将 CSS 打包到 JS 文件中，运行时动态插入样式
     * - false: 关闭默认的 CSS 处理配置，需要手动配置 loader 规则
     *
     * @example
     * ```ts
     * // 输出到独立的 CSS 文件
     * css: 'css'
     *
     * // 打包到 JS 中
     * css: 'js'
     *
     * // 自定义 CSS 处理
     * css: false
     * ```
     */
    css?: 'css' | 'js' | false;

    /**
     * 自定义 loader 配置
     *
     * 允许替换默认的 loader 实现，可用于切换到特定框架的 loader
     *
     * @example
     * ```ts
     * // 使用 Vue 的 style-loader
     * loaders: {
     *   styleLoader: 'vue-style-loader'
     * }
     * ```
     */
    loaders?: Partial<Record<keyof typeof RSPACK_LOADER, string>>;

    /**
     * style-loader 配置项
     *
     * 用于配置样式注入方式，完整选项参考:
     * https://github.com/webpack-contrib/style-loader
     *
     * @example
     * ```ts
     * styleLoader: {
     *   injectType: 'singletonStyleTag',
     *   attributes: { id: 'app-styles' }
     * }
     * ```
     */
    styleLoader?: Record<string, any>;

    /**
     * css-loader 配置项
     *
     * 用于配置 CSS 模块化、URL 解析等，完整选项参考:
     * https://github.com/webpack-contrib/css-loader
     *
     * @example
     * ```ts
     * cssLoader: {
     *   modules: true,
     *   url: false
     * }
     * ```
     */
    cssLoader?: Record<string, any>;

    /**
     * less-loader 配置项
     *
     * 用于配置 Less 编译选项，完整选项参考:
     * https://github.com/webpack-contrib/less-loader
     *
     * @example
     * ```ts
     * lessLoader: {
     *   lessOptions: {
     *     javascriptEnabled: true,
     *     modifyVars: { '@primary-color': '#1DA57A' }
     *   }
     * }
     * ```
     */
    lessLoader?: Record<string, any>;

    /**
     * style-resources-loader 配置项
     *
     * 用于自动注入全局的样式资源，完整选项参考:
     * https://github.com/yenshih/style-resources-loader
     *
     * @example
     * ```ts
     * styleResourcesLoader: {
     *   patterns: [
     *     './src/styles/variables.less',
     *     './src/styles/mixins.less'
     *   ]
     * }
     * ```
     */
    styleResourcesLoader?: Record<string, any>;

    /**
     * SWC loader 配置项
     *
     * 用于配置 TypeScript/JavaScript 编译选项，完整选项参考:
     * https://rspack.dev/guide/features/builtin-swc-loader
     *
     * @example
     * ```ts
     * swcLoader: {
     *   jsc: {
     *     parser: {
     *       syntax: 'typescript',
     *       decorators: true
     *     },
     *     transform: {
     *       legacyDecorator: true
     *     }
     *   }
     * }
     * ```
     */
    swcLoader?: SwcLoaderOptions;

    /**
     * DefinePlugin 配置项
     *
     * 用于定义编译时的全局常量，支持针对不同构建目标设置不同的值
     * 完整说明参考: https://rspack.dev/plugins/webpack/define-plugin
     *
     * @example
     * ```ts
     * // 统一的值
     * definePlugin: {
     *   'process.env.APP_ENV': JSON.stringify('production')
     * }
     *
     * // 针对不同构建目标的值
     * definePlugin: {
     *   'process.env.IS_SERVER': {
     *     server: 'true',
     *     client: 'false'
     *   }
     * }
     * ```
     */
    definePlugin?: Record<
        string,
        string | Partial<Record<BuildTarget, string>>
    >;

    /**
     * 构建目标配置
     *
     * 用于设置代码的目标运行环境，影响代码的编译降级和 polyfill 注入
     *
     * @example
     * ```ts
     * target: {
     *   // 浏览器构建目标
     *   web: ['chrome>=87', 'firefox>=78', 'safari>=14'],
     *   // Node.js 构建目标
     *   node: ['node>=16']
     * }
     * ```
     */
    target?: {
        /**
         * 浏览器构建目标
         *
         * @default ['chrome>=87', 'edge>=88', 'firefox>=78', 'safari>=14']
         */
        web?: string[];

        /**
         * Node.js 构建目标
         *
         * @default ['node>=22.6']
         */
        node?: string[];
    };
}
/**
 * 创建 Rspack HTML 应用实例。
 *
 * 该函数提供了完整的 Web 应用构建配置，支持以下资源类型的处理：
 * - TypeScript/JavaScript
 * - Web Worker
 * - JSON
 * - CSS/Less
 * - 视频/图片
 * - 字体文件
 *
 * @param gez - Gez 框架实例
 * @param options - Rspack HTML 应用配置选项
 * @returns 返回应用实例，包含中间件、渲染函数和构建函数
 *
 * @example
 * ```ts
 * // 开发环境配置
 * // entry.node.ts
 * export default {
 *   async devApp(gez) {
 *     return import('@gez/rspack').then((m) =>
 *       m.createRspackHtmlApp(gez, {
 *         // 配置 CSS 输出模式
 *         css: 'css',
 *         // 配置 TypeScript 编译选项
 *         swcLoader: {
 *           jsc: {
 *             parser: {
 *               syntax: 'typescript',
 *               decorators: true
 *             }
 *           }
 *         },
 *         // 配置构建目标
 *         target: {
 *           web: ['chrome>=87'],
 *           node: ['node>=16']
 *         },
 *         // 自定义 Rspack 配置
 *         config({ config }) {
 *           // 添加自定义 loader
 *           config.module.rules.push({
 *             test: /\.vue$/,
 *             loader: 'vue-loader'
 *           });
 *         }
 *       })
 *     );
 *   }
 * };
 *
 * // 生产环境配置
 * // entry.node.ts
 * export default {
 *   async buildApp(gez) {
 *     return import('@gez/rspack').then((m) =>
 *       m.createRspackHtmlApp(gez, {
 *         // 启用代码压缩
 *         minimize: true,
 *         // 配置全局常量
 *         definePlugin: {
 *           'process.env.NODE_ENV': JSON.stringify('production'),
 *           'process.env.IS_SERVER': {
 *             server: 'true',
 *             client: 'false'
 *           }
 *         }
 *       })
 *     );
 *   }
 * };
 * ```
 */
export async function createRspackHtmlApp(
    gez: Gez,
    options?: RspackHtmlAppOptions
) {
    options = {
        ...options,
        target: {
            web: ['chrome>=87', 'edge>=88', 'firefox>=78', 'safari>=14'],
            node: ['node>=22.6'],
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
                        test: /\.(jpe?g|png|gif|bmp|webp|svg)$/i,
                        type: 'asset/resource',
                        generator: {
                            filename: filename(gez, 'images')
                        }
                    },
                    {
                        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
                        type: 'asset/resource',
                        generator: {
                            filename: filename(gez, 'media')
                        }
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/i,
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
                        loader:
                            options.loaders?.workerRspackLoader ??
                            RSPACK_LOADER.workerRspackLoader,
                        options: {
                            esModule: false,
                            filename: `${gez.name}/workers/[name].[contenthash]${gez.isProd ? '.final' : ''}.js`
                        }
                    },
                    {
                        test: /\.(ts|mts)$/i,
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
                        if (
                            typeof targetValue === 'string' &&
                            name !== targetValue
                        ) {
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

function filename(gez: Gez, name: string, ext = '[ext]') {
    return gez.isProd
        ? `${name}/[name].[contenthash:8].final${ext}`
        : `${name}/[path][name]${ext}`;
}

function addCssConfig(
    gez: Gez,
    options: RspackHtmlAppOptions,
    { config }: RspackAppConfigContext
) {
    if (options.css === false) {
        return;
    }
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
                    use: [...cssRule, ...lessRule],
                    type: 'javascript/auto'
                },
                {
                    test: /\.css$/,
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
                use: [...lessLoaders],
                type: 'css'
            }
        ]
    };
}
