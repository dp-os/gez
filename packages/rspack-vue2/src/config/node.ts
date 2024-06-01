import { builtinModules } from 'node:module';

import { type Gez } from '@gez/core';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { type RspackOptions } from '@rspack/core';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import write from 'write';

import { createBaseConfig } from './base';

export function createNodeConfig(
    gez: Gez,
    buildTarget: 'server' | 'node' = 'node'
) {
    const base = createBaseConfig(gez);
    const ENTRY_CJS = `entry-${buildTarget}.cjs`;
    const ENTRY_HOT_CJS = `entry-${buildTarget}.hot.cjs`;

    const FULL_ENTRY_HOT_CJS = path.resolve(
        gez.getProjectPath(`dist/${buildTarget}`),
        ENTRY_HOT_CJS
    );
    const FULL_ENTRY =
        buildTarget === 'node'
            ? gez.getProjectPath(`dist/node/entry-node.js`)
            : gez.getProjectPath(`dist/server/entry-server.js`);

    const files: Record<string, string> = {
        [FULL_ENTRY_HOT_CJS]: `
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
        [FULL_ENTRY]: `
import hot from './${ENTRY_HOT_CJS}';
export const module = hot.module;
export const dispose = hot.dispose;
export default hot.module.default;
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
            main: gez.getProjectPath(`src/entry-${buildTarget}.ts`)
        },
        optimization: {
            ...base.optimization,
            minimize: false
        },
        output: {
            ...base.output,
            path: gez.getProjectPath(`dist/${buildTarget}`),
            filename: path.resolve(
                gez.getProjectPath(`dist/${buildTarget}`),
                ENTRY_CJS
            ),
            library: {
                type: 'commonjs2'
            }
        },
        externalsPresets: {
            node: true
        },
        externalsType: 'commonjs',
        externals: [
            '@gez/core',
            buildTarget === 'node' ? (nodeExternals as Function)() : {},
            nodeFullModule()
        ]
    } satisfies RspackOptions;
}

function nodeFullModule() {
    const externals: Record<string, string> = {};
    builtinModules
        .filter((x) => !/^_|^sys$/.test(x))
        .forEach((name) => {
            externals[name] = name;
            externals[`node:${name}`] = `node:${name}`;
        });

    return externals;
}
