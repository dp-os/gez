import { type Gez } from '@gez/core';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack, type RspackOptions } from '@rspack/core';

import { createBaseConfig } from './base';

export function createClientConfig(gez: Gez) {
    const base = createBaseConfig(gez);
    if (!gez.isProd) {
        base.plugins.push(new rspack.HotModuleReplacementPlugin());
    }
    return {
        ...base,
        plugins: [
            ...base.plugins
            // new ModuleFederationPlugin({
            //     name: 'ssr_test2',
            //     filename: 'js/exposes.js',
            //     library: {
            //         type: 'module'
            //     },
            //     exposes: {
            //         './src/button.vue': './src/button.vue'
            //     },
            //     dts: {
            //         generateTypes: {
            //             compilerInstance: 'vue-tsc'
            //         }
            //     }
            // })
        ],
        target: 'web',
        optimization: {
            ...base.optimization,
            minimize: true
        },
        entry: {
            ...base.entry,
            app: gez.isProd
                ? [gez.getProjectPath('src/entry-client.ts')]
                : [
                      `webpack-hot-middleware/client?path=${gez.base}hot-middleware&timeout=5000&overlay=false`,
                      gez.getProjectPath('src/entry-client.ts')
                  ]
        },
        output: {
            ...base.output,
            filename: gez.isProd
                ? 'js/[name].[contenthash:8].js'
                : 'js/[name].js',
            path: gez.getProjectPath('dist/client')
        }
    } satisfies RspackOptions;
}
