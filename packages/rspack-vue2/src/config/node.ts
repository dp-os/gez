import { type Gez } from '@gez/core';
import { type RspackOptions } from '@rspack/core';
import nodeExternals from 'webpack-node-externals';

import { createBaseConfig } from './base';

export function createNodeConfig(gez: Gez) {
    const base = createBaseConfig(gez);
    return {
        ...base,
        plugins: [...base.plugins],
        target: 'node20',
        optimization: {
            ...base.optimization,
            minimize: false
        },
        entry: {
            ...base.entry,
            app: {
                import: gez.getProjectPath(`src/entry-node.ts`),
                library: {
                    type: 'module'
                }
            }
        },
        output: {
            ...base.output,
            filename: gez.getProjectPath('dist/node/entry-node.js'),
            module: true
        },
        externalsPresets: {
            node: true
        },
        ignoreWarnings: [...base.ignoreWarnings],
        externals: ['@gez/core']
    } satisfies RspackOptions;
}
