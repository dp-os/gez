import webpack from 'webpack';
import hash from 'hash-sum';
import { EntryInfoAssets, isJS, isCSS } from './util';

interface VueClientPluginOptions {
    filename?: string;
}

export class VueClientPlugin {
    public options: VueClientPluginOptions;
    public constructor(options: VueClientPluginOptions) {
        this.options = options;
    }
    public get filename() {
        return this.options.filename || 'vue-ssr-client-manifest.json';
    }
    public apply(compiler: webpack.Compiler) {
        compiler.hooks.emit.tapPromise(
            'vue-client-plugin',
            async (compilation) => {
                const stats = compilation.getStats().toJson();
                const assets: EntryInfoAssets[] = stats.assets;
                const entrypoints = Object.keys(stats.entrypoints);
                const allFiles = [...new Set(assets.map((a) => a.name))];
                const initialFiles = entrypoints
                    .map((name) => {
                        return stats.entrypoints[name]
                            .assets as EntryInfoAssets[];
                    })
                    .reduce((assets, all) => all.concat(assets), [])
                    .map((item) => item.name)
                    .filter((file) => isJS(file) || isCSS(file));

                const asyncFiles = allFiles
                    .filter((file) => isJS(file) || isCSS(file))
                    .filter((file) => initialFiles.indexOf(file) < 0);
                const manifest = {
                    publicPath: stats.publicPath,
                    all: allFiles,
                    initial: initialFiles,
                    async: asyncFiles,
                    modules: {}
                };
                const assetModules = stats.modules.filter(
                    (m) => m.assets.length
                );
                const fileToIndex = (file: string) =>
                    manifest.all.indexOf(file);
                stats.modules.forEach((m) => {
                    if (m.chunks.length !== 1) return;
                    const cid = m.chunks[0];
                    const chunk = stats.chunks.find((c) => c.id === cid);
                    if (!chunk || !chunk.files) {
                        return;
                    }
                    const id = m.identifier.replace(/\s\w+$/, '');
                    const files = (manifest.modules[hash(id)] = chunk.files.map(
                        fileToIndex
                    ));
                    assetModules.forEach((m) => {
                        if (m.chunks.some((id) => id === cid)) {
                            files.push.apply(files, m.assets.map(fileToIndex));
                        }
                    });
                });

                const json = JSON.stringify(manifest, null, 2);
                compilation.assets[this.options.filename] = {
                    source: () => json,
                    size: () => json.length
                } as any;
            }
        );
    }
}
