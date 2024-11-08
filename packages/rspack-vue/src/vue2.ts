import type { Gez } from '@gez/core';
import {
    type RspackHtmlAppOptions,
    createRspackHtmlApp,
    rspack
} from '@gez/rspack';
import { VueLoaderPlugin } from 'vue2-loader';

export interface RspackVue2AppOptions extends RspackHtmlAppOptions {}

export function createRspackVue2App(gez: Gez, options?: RspackVue2AppOptions) {
    return createRspackHtmlApp(gez, {
        ...options,
        config(context) {
            const { config, buildTarget } = context;
            config.resolve = config.resolve || {};
            config.resolve = {
                ...config.resolve,
                extensions: ['.vue', ...(config.resolve.extensions ?? [])]
            };
            config.resolve.extensions = ['.ts', '.vue', '...'];
            config.plugins = config.plugins || [];
            // @ts-ignore
            config.plugins.push(new VueLoaderPlugin());
            if (buildTarget === 'client') {
                config.plugins.push(
                    new rspack.DefinePlugin({
                        'process.env.VUE_ENV': JSON.stringify(buildTarget)
                    })
                );
            }
            config.module = {
                ...config.module,
                rules: [
                    ...(config.module?.rules ?? []),
                    {
                        test: /\.vue$/,
                        use: [
                            {
                                loader: resolve('./vue2-loader.mjs')
                            },
                            {
                                loader: resolve('vue2-loader'),
                                options:
                                    buildTarget === 'server'
                                        ? {
                                              experimentalInlineMatchResource: true,
                                              optimizeSSR: true
                                          }
                                        : {
                                              experimentalInlineMatchResource: true
                                          }
                            }
                        ]
                    },
                    {
                        test: /\.less$/,
                        loader: resolve('less-loader'),
                        type: 'css'
                    }
                ]
            };
            config.resolve!.alias = {
                ...config.resolve!.alias!,
                vue$: 'vue/dist/vue.esm.js'
            };
            config.ignoreWarnings = [
                ...(config.ignoreWarnings ?? []),
                (warning) => {
                    // @ts-ignore
                    return warning.moduleDescriptor.name.includes(
                        'vue-server-renderer'
                    );
                }
            ];
            options?.config?.(context);
        }
    });
}

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
