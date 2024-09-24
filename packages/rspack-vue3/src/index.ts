import type { Gez } from '@gez/core';
import { createApp as _createApp, defineConfig } from '@gez/rspack';
import { VueLoaderPlugin } from 'vue-loader';

const vue3Config = defineConfig(({ config, buildTarget }) => {
    const vueLoader = new URL(import.meta.resolve('vue-loader')).pathname;
    const vueStyleLoader = new URL(import.meta.resolve('vue-style-loader'))
        .pathname;
    const cssLoader = new URL(import.meta.resolve('css-loader')).pathname;
    const lessLoader = new URL(import.meta.resolve('less-loader')).pathname;
    const styleResourcesLoader = new URL(
        import.meta.resolve('style-resources-loader')
    ).pathname;
    const varLess = new URL(import.meta.resolve('./var.less')).pathname;
    config.resolve!.extensions = [
        ...config.resolve!.extensions!,
        '.vue',
        '.ts',
        '...'
    ];
    config.experiments!.css = false;
    config.plugins = [...config.plugins!, new VueLoaderPlugin() as any];
    config.module!.rules = [
        ...config.module!.rules!,
        {
            test: /\.vue$/,
            use: vueLoader
            // options: {
            //     experimentalInlineMatchResource: true
            // }
        },
        {
            test: /\.less$/,
            use: [
                vueStyleLoader,
                cssLoader,
                lessLoader,
                {
                    loader: styleResourcesLoader,
                    options: {
                        patterns: [varLess]
                    }
                }
            ],
            type: 'javascript/auto'
        },
        {
            test: /\.css$/,
            use: [vueStyleLoader, cssLoader],
            type: 'javascript/auto'
        }
    ];
    config.resolve!.alias = {
        ...config.resolve!.alias!
        // vue$: 'vue/dist/vue.esm-bundler.js'
    };
    if (buildTarget === 'server') {
        config.ignoreWarnings = [
            ...config.ignoreWarnings!,
            (warning) => {
                return warning.moduleDescriptor.name.includes(
                    'vue-server-renderer'
                );
            }
        ];
    }
    return config;
});
export function createApp(gez: Gez) {
    return _createApp(gez, vue3Config);
}