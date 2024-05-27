import { type Gez } from '@gez/core';
import { type RspackOptions } from '@rspack/core';

import { createBaseConfig } from './base';

export function createNodeConfig(gez: Gez) {
    const base = createBaseConfig(gez);
    return {
        ...base,
        target: 'node',
        entry: {
            ...base.entry,
            main: gez.getProjectPath('src/entry-node.ts')
        },
        optimization: {
            ...base.optimization,
            minimize: false
        },
        output: {
            ...base.output,
            filename: gez.getProjectPath('dist/node/entry-node.js'),
            path: gez.getProjectPath('dist/node'),
            chunkFormat: 'module',
            library: {
                type: 'module'
            }
        }
    } satisfies RspackOptions;
}
