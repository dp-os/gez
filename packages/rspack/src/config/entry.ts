import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['entry']>;
export class Entry extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        const hotPath = import.meta.resolve('webpack-hot-middleware/client');
        const importPaths: string[] = gez.isProd
            ? [gez.getProjectPath('src/entry-client.ts')]
            : [
                  `${hotPath}?path=${gez.base}hot-middleware&timeout=5000&overlay=false`,
                  gez.getProjectPath('src/entry-client.ts')
              ];
        return {
            index: {
                import: importPaths,
                library: {
                    type: 'module'
                }
            }
        };
    }

    protected getServer(): Config {
        const { gez } = this;
        const importPaths: string[] = [
            gez.getProjectPath(`src/entry-server.ts`)
        ];
        return {
            index: {
                import: importPaths,
                library: {
                    type: 'module'
                }
            }
        };
    }

    protected getNode(): Config {
        const { gez } = this;
        const importPaths: string[] = [gez.getProjectPath(`src/entry-node.ts`)];
        return {
            index: {
                import: importPaths,
                library: {
                    type: 'module'
                }
            }
        };
    }
}