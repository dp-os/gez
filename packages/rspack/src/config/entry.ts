import type { RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['entry']>;
export class Entry extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        const importPaths: string[] = gez.isProd
            ? [gez.getProjectPath('src/entry-client.ts')]
            : [
                  `webpack-hot-middleware/client?path=${gez.base}hot-middleware&timeout=5000&overlay=false`,
                  gez.getProjectPath('src/entry-client.ts')
              ];
        return {
            app: {
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
            app: {
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
            app: {
                import: importPaths,
                library: {
                    type: 'module'
                }
            }
        };
    }
}
