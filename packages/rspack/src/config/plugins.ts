import { type Compiler, rspack, type RspackOptions } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['plugins']>;

export class Plugins extends BuildConfig<Config> {
    protected getClient(): Config {
        const { gez } = this;
        const plugins: Config = [new ImportmapPlugin()];
        if (!gez.isProd) {
            plugins.push(new rspack.HotModuleReplacementPlugin());
        }
        return plugins;
    }

    protected getServer(): Config {
        return [new ImportmapPlugin()];
    }

    protected getNode(): Config {
        return [];
    }
}

interface StatsJson {
    name: string;
    hash: string;
    entrypoints: Record<string, Entrypoints>;
}

export interface Entrypoints {
    name: string;
    chunks: string[];
    assets: Asset[];
    filteredAssets: number;
    assetsSize: number;
}

export interface Asset {
    name: string;
    size: number;
}

class ImportmapPlugin {
    public apply(compiler: Compiler) {
        compiler.hooks.thisCompilation.tap(
            'importmap-plugin',
            (compilation) => {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'importmap-plugin',
                        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
                    },
                    (assets) => {
                        const stats: StatsJson = compilation.getStats().toJson({
                            all: false,
                            hash: true,
                            entrypoints: true
                        });
                        const files = Object.keys(stats.entrypoints)
                            .map((name) => {
                                const item = stats.entrypoints[name];
                                const file = item.assets.find((item) => {
                                    return item.name.endsWith('.js');
                                });
                                if (file) {
                                    return {
                                        name,
                                        file: file.name
                                    };
                                }
                                return null;
                            })
                            .filter((item) => item);
                        const { RawSource } = compiler.webpack.sources;
                        const source = new RawSource(
                            `
((global) => {
    const name = "${stats.name}";
    const files = ${JSON.stringify(files)};
    const importmapKey = '__importmap__';
    const importmap = global[importmapKey] = global[importmapKey] || {};
    const imports = importmap.imports = importmap.imports || {};
    files.forEach(item => {
        imports[name + "/" + item.name] = "/" + name + "/" + item.file;
    });
})(globalThis);
`.trim()
                        );
                        compilation.emitAsset('importmap.js', source);

                        const importmap = JSON.stringify(
                            {
                                imports: files.reduce<Record<string, string>>(
                                    (obj, item) => {
                                        if (item) {
                                            const { name, file } = item;
                                            const key = `${stats.name}/${name}`;
                                            const value = `/${stats.name}/${file}`;
                                            obj[key] = value;
                                        }
                                        return obj;
                                    },
                                    {}
                                )
                            },
                            null,
                            4
                        );
                        compilation.emitAsset(
                            'importmap.json',
                            new RawSource(importmap)
                        );
                    }
                );
            }
        );
    }
}
