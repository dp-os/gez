import { type Gez } from '@gez/core';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { type RspackOptions } from '@rspack/core';
import write from 'write';

import { createBaseConfig } from './base';

export function createServerConfig(gez: Gez) {
    const base = createBaseConfig(gez);
    write.sync(
        gez.getProjectPath('dist/server/entry-server.js'),
        `
import module from './entry-server.cjs';

export { module  }
`
    );
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
            //     dts: false
            // })
        ],
        target: 'node20',
        entry: {
            ...base.entry,
            main: gez.getProjectPath('src/entry-server.ts')
        },
        optimization: {
            ...base.optimization,
            minimize: false
        },
        output: {
            ...base.output,
            path: gez.getProjectPath('dist/server'),
            filename: gez
                .getProjectPath('dist/server/entry-server.js')
                .replace(/\.js$/, '.cjs'),
            library: {
                type: 'commonjs2'
            }
        },
        externals: ['@gez/core']
    } satisfies RspackOptions;
}
