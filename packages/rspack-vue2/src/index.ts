import { defineConfig } from '@gez/rspack';
import { VueLoaderPlugin } from 'vue-loader';

export const vue2Config = defineConfig(({ config, buildTarget }) => {
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
            use: 'vue-loader'
        },
        {
            test: /\.less$/,
            use: ['vue-style-loader', 'css-loader', 'less-loader'],
            type: 'javascript/auto'
        },
        {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader'],
            type: 'javascript/auto'
        }
    ];
    config.resolve!.alias = {
        ...config.resolve!.alias!,
        vue$: 'vue/dist/vue.esm.js'
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
