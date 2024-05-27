import { type Gez } from '@gez/core';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { type RspackOptions } from '@rspack/core';

import { createBaseConfig } from './base';

export function createClientConfig(gez: Gez) {
    const base = createBaseConfig(gez);
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
        entry: {
            ...base.entry,
            main: gez.getProjectPath('src/entry-client.ts')
        },
        output: {
            ...base.output,
            filename: 'js/main.js',
            path: gez.getProjectPath('dist/client'),
            chunkFormat: 'module',
            module: true,
            library: {
                type: 'module'
            }
        }
    } satisfies RspackOptions;
}
