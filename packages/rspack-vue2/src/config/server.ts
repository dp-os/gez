import { type Gez } from '@gez/core';
import { type RspackOptions } from '@rspack/core';

import { createBaseConfig } from './base';

export function createServerConfig(gez: Gez) {
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
                import: gez.getProjectPath(`src/entry-server.ts`),
                library: {
                    type: 'module'
                }
            }
        },
        output: {
            ...base.output,
            filename: gez.getProjectPath('dist/server/entry-server.js'),
            module: true
        },
        externalsPresets: {
            node: true
        },
        ignoreWarnings: [...base.ignoreWarnings, /vue-server-renderer/],
        externals: ['@gez/core']
    } satisfies RspackOptions;
}
