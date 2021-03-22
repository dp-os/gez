"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueClientPlugin = void 0;
const hash_sum_1 = __importDefault(require("hash-sum"));
const util_1 = require("./util");
class VueClientPlugin {
    constructor(options) {
        this.options = options;
    }
    get filename() {
        return this.options.filename || 'vue-ssr-client-manifest.json';
    }
    apply(compiler) {
        compiler.hooks.emit.tapPromise('vue-client-plugin', async (compilation) => {
            const stats = compilation.getStats().toJson();
            const assets = stats.assets;
            const entrypoints = Object.keys(stats.entrypoints);
            const allFiles = [...new Set(assets.map((a) => a.name))];
            const initialFiles = entrypoints
                .map((name) => {
                return stats.entrypoints[name]
                    .assets;
            })
                .reduce((assets, all) => all.concat(assets), [])
                .map((item) => item.name)
                .filter((file) => util_1.isJS(file) || util_1.isCSS(file));
            const asyncFiles = allFiles
                .filter((file) => util_1.isJS(file) || util_1.isCSS(file))
                .filter((file) => initialFiles.indexOf(file) < 0);
            const manifest = {
                publicPath: stats.publicPath,
                all: allFiles,
                initial: initialFiles,
                async: asyncFiles,
                modules: {}
            };
            const assetModules = stats.modules.filter((m) => m.assets.length);
            const fileToIndex = (file) => {
                return manifest.all.indexOf(String(file));
            };
            stats.modules.forEach((m) => {
                if (m.chunks.length !== 1)
                    return;
                const cid = m.chunks[0];
                const chunk = stats.chunks.find((c) => c.id === cid);
                if (!chunk || !chunk.files) {
                    return;
                }
                const id = m.identifier.replace(/\s\w+$/, '');
                const files = (manifest.modules[hash_sum_1.default(id)] = chunk.files.map(fileToIndex));
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
            };
        });
    }
}
exports.VueClientPlugin = VueClientPlugin;
