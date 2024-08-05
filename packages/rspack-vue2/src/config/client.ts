import { type Gez } from '@gez/core';
import { rspack, type RspackOptions } from '@rspack/core';

import { createBaseConfig } from './base';

export function createClientConfig(gez: Gez) {
    const base = createBaseConfig(gez);
    if (!gez.isProd) {
        base.plugins.push(new rspack.HotModuleReplacementPlugin());
    }
    return {
        ...base,
        plugins: [...base.plugins],
        target: 'web',
        optimization: {
            ...base.optimization,
            minimize: false
        },
        entry: {
            ...base.entry,
            app: {
                import: gez.isProd
                    ? [gez.getProjectPath('src/entry-client.ts')]
                    : [
                          `webpack-hot-middleware/client?path=${gez.base}hot-middleware&timeout=5000&overlay=false`,
                          gez.getProjectPath('src/entry-client.ts')
                      ],
                library: {
                    type: 'module'
                }
            }
        },
        output: {
            ...base.output,
            module: true,
            // chunkFormat: 'module',
            // chunkLoading: 'import',
            filename: gez.isProd
                ? 'js/[name].[contenthash:8].js'
                : 'js/[name].js',
            path: gez.getProjectPath('dist/client')
        }
    } satisfies RspackOptions;
}
