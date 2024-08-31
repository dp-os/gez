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
                        const files = Object.keys(assets)
                            .filter((file) => {
                                return (
                                    file.endsWith('.js') &&
                                    !file.startsWith('chunk/')
                                );
                            })
                            .map((file) => {
                                const [name, ...hash] = file.split('.');
                                return { name, file: hash.join('.') };
                            });
                        const { RawSource } = compiler.webpack.sources;
                        const source = new RawSource(
                            `
((win) => {
    const name = "ssr-rspack-vue2";
    const files = ${JSON.stringify(files)};
    const importmapKey = '__importmap__';
    const importmap = win[importmapKey] = win[importmapKey] || {};
    const imports = importmap.imports = importmap.imports || {};
    files.forEach(item => {
        imports[name + "/" + item.name] = "/" + name + "/" + item.name + '.' + item.file;
    });
})(window);
`.trim()
                        );
                        compilation.emitAsset('importmap.js', source);
                    }
                );
            }
        );
    }
}
