import type { Gez } from '@gez/core';
import {
    type RspackHtmlAppOptions,
    createRspackHtmlApp,
    rspack
} from '@gez/rspack';
import { VueLoaderPlugin as VueLoader2Plugin } from 'vue2-loader';
import { VueLoaderPlugin as VueLoader3Plugin } from 'vue3-loader';
import { vue2Loader } from './vue2-loader';
import { vue3Loader } from './vue3-loader';

export interface RspackVueAppOptions extends RspackHtmlAppOptions {
    /**
     * 透传：https://github.com/vuejs/vue-loader
     */
    vueLoader?: Record<string, any>;
}

type VueType = '2' | '3';

export function createRspackVueApp(
    gez: Gez,
    vueType: VueType,
    options?: RspackVueAppOptions
) {
    return createRspackHtmlApp(gez, {
        ...options,
        config(context) {
            const { config, buildTarget } = context;
            // 支持 Vue 拓展名
            config.resolve = {
                ...config.resolve,
                extensions: ['.vue', ...(config.resolve?.extensions ?? [])]
            };
            config.plugins = config.plugins || [];
            switch (vueType) {
                case '2':
                    // @ts-ignore
                    config.plugins.push(new VueLoader2Plugin());
                    break;
                case '3':
                    config.plugins.push(new VueLoader3Plugin());
                    break;
            }
            // 设置 Vue 相关的环境变量
            if (buildTarget === 'client') {
                config.plugins.push(
                    new rspack.DefinePlugin({
                        'process.env.VUE_ENV': JSON.stringify(buildTarget)
                    })
                );
            }
            // 设置 vue-loader
            const vueRuleUse: rspack.RuleSetUse = [
                {
                    loader: resolve(`vue${vueType}-loader`),
                    options: {
                        ...options?.vueLoader,
                        experimentalInlineMatchResource: true,
                        optimizeSSR: buildTarget === 'server'
                    }
                }
            ];
            switch (vueType) {
                case '2':
                    vueRuleUse.unshift(vue2Loader);
                    break;
                case '3':
                    vueRuleUse.unshift(vue3Loader);
                    break;
            }

            config.module = {
                ...config.module,
                rules: [
                    ...(config.module?.rules ?? []),
                    {
                        test: /\.vue$/,
                        use: vueRuleUse
                    }
                ]
            };
            // 设置 vue 别名
            let vueAlias: string | null = null;
            switch (vueType) {
                case '2':
                    vueAlias = 'vue/dist/vue.esm.js';
                    break;
                case '3':
                    vueAlias = 'vue/dist/vue.runtime.esm-browser.js';
                    break;
            }
            if (vueAlias) {
                config.resolve!.alias = {
                    ...config.resolve!.alias!,
                    vue$: vueAlias
                };
            }
            // 设置 vue 相关忽略信息。
            if (vueType === '2') {
                config.ignoreWarnings = [
                    ...(config.ignoreWarnings ?? []),
                    (warning) => {
                        // @ts-ignore
                        return warning.moduleDescriptor.name.includes(
                            'vue-server-renderer'
                        );
                    }
                ];
            }
            // 设置自定义配置
            options?.config?.(context);
        }
    });
}

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
