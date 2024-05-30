import { type Gez } from '@gez/core';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { type RspackOptions } from '@rspack/core';
import path from 'path';
import write from 'write';

import { createBaseConfig } from './base';

export function createServerConfig(gez: Gez) {
    const base = createBaseConfig(gez);
    const ENTRY_CJS = 'entry-server.cjs';
    const ENTRY_HOT_CJS = 'entry-server.hot.cjs';

    const files: Record<string, string> = {
        [path.resolve(gez.getProjectPath('dist/server'), ENTRY_HOT_CJS)]: `
module.exports = {
    dispose (base) {
        Object.keys(require.cache).forEach(file => {
            if (file.startsWith(base)) {
                delete require.cache[file]
            }
        })
    },
    module: require('./${ENTRY_CJS}')
}
`,
        [gez.getProjectPath('dist/server/entry-server.js')]: `
import hot from './${ENTRY_HOT_CJS}';
export const module = hot.module;
export const dispose = hot.dispose;
`
    };
    Object.keys(files).forEach((file) => {
        write.sync(file, files[file].trimStart());
    });
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
            filename: path.resolve(
                gez.getProjectPath('dist/server'),
                ENTRY_CJS
            ),
            library: {
                type: 'commonjs2'
            }
        },
        externals: ['@gez/core']
    } satisfies RspackOptions;
}
