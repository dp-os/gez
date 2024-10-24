import type { Gez } from '@gez/core';
import {
    type RuleSetRule,
    type UpdateBuildContext,
    createApp,
    rspack
} from '@gez/rspack';
import { VueLoaderPlugin as Vue2LoaderPlugin } from '@gez/vue2-loader';
import { VueLoaderPlugin as Vue3LoaderPlugin } from 'vue-loader';

export * from '@gez/rspack';

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
export type VueVersion = 2 | 3;
export interface BuildOptions {
    /**
     * 透传 https://github.com/vuejs/vue-style-loader
     */
    vueStyleLoader?: Record<string, any>;
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
     * 透传 DefinePlugin 的值
     */
    definePlugin?: Record<string, string>;
}

function createVersion(version: VueVersion = 3) {
    return <T>(options: Record<VueVersion, T>) => {
        return options[version];
    };
}

export function createVue2App(
    gez: Gez,
    updateBuildContext?: UpdateBuildContext<BuildOptions>
) {
    return createVueApp(gez, 2, updateBuildContext);
}

export function createVue3App(
    gez: Gez,
    updateBuildContext?: UpdateBuildContext<BuildOptions>
) {
    return createVueApp(gez, 3, updateBuildContext);
}

function createVueApp(
    gez: Gez,
    vueVersion: VueVersion,
    updateBuildContext?: UpdateBuildContext<BuildOptions>
) {
    return createApp(gez, (buildContext) => {
        const options: BuildOptions = updateBuildContext?.(buildContext) ?? {};
        const useVue = createVersion(vueVersion);
        const { config, target } = buildContext;
        config.resolve!.extensions = ['.ts', '.vue', '...'];
        config.experiments!.css = false;
        config.plugins = [
            ...config.plugins!,
            useVue<any>({
                '2': new Vue2LoaderPlugin(),
                '3': new Vue3LoaderPlugin()
            })
        ];
        if (target === 'client') {
            config.plugins.push(
                new rspack.DefinePlugin({
                    'process.env.VUE_ENV': JSON.stringify(target)
                })
            );
        }
        if (options.definePlugin) {
            config.plugins.push(new rspack.DefinePlugin(options.definePlugin));
        }

        const cssRule = [
            {
                loader: resolve('vue-style-loader'),
                options: options.vueStyleLoader
            },
            {
                loader: resolve('css-loader'),
                options: options.cssLoader
            },
            {
                loader: 'builtin:lightningcss-loader',
                options: {
                    targets: gez.browserslist
                }
            }
        ];
        const lessRule = [
            {
                loader: resolve('less-loader'),
                options: options.lessLoader
            }
        ];
        if (options.styleResourcesLoader) {
            lessRule.push({
                loader: resolve('style-resources-loader'),
                options: options.styleResourcesLoader
            });
        }
        config.module!.rules = [
            ...config.module!.rules!,
            useVue<RuleSetRule>({
                '2': {
                    test: /\.vue$/,
                    loader: resolve('@gez/vue2-loader'),
                    options:
                        target === 'server'
                            ? {
                                  optimizeSSR: true
                              }
                            : {}
                },
                '3': {
                    test: /\.vue$/,
                    loader: resolve('vue-loader')
                }
            }),
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
        ];
        config.resolve!.alias = {
            ...config.resolve!.alias!,
            vue$: useVue({
                '2': 'vue/dist/vue.esm.js',
                '3': 'vue/dist/vue.runtime.esm-browser.js'
            })
        };
        config.ignoreWarnings = useVue({
            '2':
                target === 'server'
                    ? [
                          ...config.ignoreWarnings!,
                          (warning) => {
                              // @ts-ignore
                              return warning.moduleDescriptor.name.includes(
                                  'vue-server-renderer'
                              );
                          }
                      ]
                    : config.ignoreWarnings,
            '3': config.ignoreWarnings!
        });
    });
}
