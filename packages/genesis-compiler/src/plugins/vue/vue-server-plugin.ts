import webpack from 'webpack';
import { isJS, EntryInfo, EntryInfoAssets } from './util';

interface VueServerPluginOptions {
    filename: string;
}
interface EntryBundle {
    entry: string;
    files: {
        [x: string]: string;
    };
    maps: {
        [x: string]: {
            version: number;
            sources: string[];
            names: string[];
            mappings: string;
            file: string;
            sourcesContent: string[];
            sourceRoot: string;
        };
    };
}

export class VueServerPlugin {
    public options: Partial<VueServerPluginOptions>;
    public constructor(options: Partial<VueServerPluginOptions>) {
        this.options = options;
    }
    public get filename() {
        return this.options.filename || 'vue-ssr-server-bundle.json';
    }
    public apply(compiler: webpack.Compiler) {
        compiler.hooks.emit.tapPromise(
            'vue-server-plugin',
            async (compilation) => {
                const stats = compilation.getStats().toJson();
                const entryName = Object.keys(stats.entrypoints)[0];
                const entryInfo: EntryInfo = stats.entrypoints[entryName];

                if (!entryInfo) return;
                const entryAssets: EntryInfoAssets[] = entryInfo.assets.filter(
                    (item) => isJS(item.name)
                );
                if (entryAssets.length > 1) {
                    throw new Error(
                        `Server-side bundle should have one single entry file. Avoid using CommonsChunkPlugin in the server config.`
                    );
                }
                const entry = entryAssets[0];
                if (typeof entry?.name !== 'string') {
                    throw new Error(
                        `Entry "${entryName}" not found. Did you specify the correct entry option?`
                    );
                }
                const bundle: EntryBundle = {
                    entry: entry.name,
                    files: {},
                    maps: {}
                };
                const toString = (text: string | Buffer) => {
                    if (Buffer.isBuffer(text)) {
                        return Buffer.from(text).toString();
                    }
                    return text;
                };
                stats.assets.forEach((asset: webpack.Asset) => {
                    const name = asset.name;
                    if (isJS(name)) {
                        bundle.files[name] = toString(
                            compilation.assets[name].source()
                        );
                        const sourceMap = asset.info?.related?.sourceMap;
                        if (typeof sourceMap === 'string') {
                            bundle.maps[
                                sourceMap.replace(/\.map$/, '')
                            ] = JSON.parse(
                                toString(compilation.assets[sourceMap].source())
                            );
                        }
                    }
                    delete compilation.assets[name];
                });
                const json = JSON.stringify(bundle, null, 4);
                const filename = this.options.filename;
                compilation.assets[filename] = {
                    name: filename,
                    source: () => json,
                    size: () => json.length
                } as any;
            }
        );
    }
}
