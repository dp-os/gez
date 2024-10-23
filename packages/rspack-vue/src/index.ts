import type { Gez } from '@gez/core';
import {
    type RuleSetRule,
    type UpdateBuildContext,
    createApp as _createApp,
    rspack
} from '@gez/rspack';
import { VueLoaderPlugin as Vue2LoaderPlugin } from '@gez/vue2-loader';
import { VueLoaderPlugin as Vue3LoaderPlugin } from 'vue-loader';

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
export type VueVersion = 2 | 3;
export interface BuildOptions {
    /**
     * Vue 的 版本
     */
    vue?: VueVersion;
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
}

function createVersion(version: VueVersion = 3) {
    return <T>(options: Record<VueVersion, T>) => {
        return options[version];
    };
}

export function createApp(
    gez: Gez,
    updateBuildContext?: UpdateBuildContext<BuildOptions>
) {
    return _createApp(gez, (buildContext) => {
        const options: BuildOptions = updateBuildContext?.(buildContext) ?? {};
        const useVue = createVersion(options.vue);
        const { config, target } = buildContext;
        config.resolve!.extensions = ['.js', '.ts', '.vue', '.json', '...'];
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
        const cssRule = [
            {
                loader: resolve('vue-style-loader'),
                options: options.vueStyleLoader
            },
            {
                loader: resolve('css-loader'),
                options: options.cssLoader
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
