"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VuePlugin = void 0;
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const client_plugin_1 = __importDefault(require("vue-server-renderer/client-plugin"));
const plugin_1 = __importDefault(require("vue-loader/lib/plugin"));
const genesis_core_1 = require("@fmfe/genesis-core");
const isJS = (file) => {
    return /\.js(\?[^.]+)?$/.test(file);
};
class VueServerPlugin {
    constructor(options) {
        this.options = options;
    }
    get filename() {
        return this.options.filename || 'vue-ssr-server-bundle.json';
    }
    apply(compiler) {
        compiler.hooks.emit.tapPromise('vue-server-plugin', async (compilation) => {
            const stats = compilation.getStats().toJson();
            const entryName = Object.keys(stats.entrypoints)[0];
            const entryInfo = stats.entrypoints[entryName];
            if (!entryInfo)
                return;
            const entryAssets = entryInfo.assets.filter((item) => isJS(item.name));
            if (entryAssets.length > 1) {
                throw new Error(`Server-side bundle should have one single entry file. Avoid using CommonsChunkPlugin in the server config.`);
            }
            const entry = entryAssets[0];
            if (typeof (entry === null || entry === void 0 ? void 0 : entry.name) !== 'string') {
                throw new Error(`Entry "${entryName}" not found. Did you specify the correct entry option?`);
            }
            const bundle = {
                entry: entry.name,
                files: {},
                maps: {}
            };
            const toString = (text) => {
                if (Buffer.isBuffer(text)) {
                    return Buffer.from(text).toString();
                }
                return text;
            };
            stats.assets.forEach((asset) => {
                var _a, _b, _c, _d, _e;
                const name = asset.name;
                if (!isJS(name))
                    return;
                bundle.files[name] = toString(compilation.assets[name].source());
                const sourceMap = (_b = (_a = asset.info) === null || _a === void 0 ? void 0 : _a.related) === null || _b === void 0 ? void 0 : _b.sourceMap;
                if (typeof sourceMap === 'string') {
                    bundle.maps[sourceMap.replace(/\.map$/, '')] = JSON.parse(toString(compilation.assets[sourceMap].source()));
                    console.log('>>>>>>>', (_c = asset.info) === null || _c === void 0 ? void 0 : _c.related);
                    (_e = (_d = asset.info) === null || _d === void 0 ? void 0 : _d.related) === null || _e === void 0 ? true : delete _e.sourceMap;
                }
                delete compilation.assets[name];
            });
            const json = JSON.stringify(bundle, null, 4);
            const filename = this.options.filename;
            compilation.assets[filename] = {
                name: filename,
                source: () => json,
                size: () => json.length
            };
        });
    }
}
class VuePlugin extends genesis_core_1.Plugin {
    chainWebpack({ target, config }) {
        const { ssr } = this;
        switch (target) {
            case 'client':
                config.plugin('vue-ssr-client').use(client_plugin_1.default, [
                    {
                        filename: path_1.default.relative(ssr.outputDirInClient, ssr.outputClientManifestFile)
                    }
                ]);
                break;
            case 'server':
                config.plugin('vue-ssr-server').use(new VueServerPlugin({
                    filename: path_1.default.relative(ssr.outputDirInServer, ssr.outputServerBundleFile)
                }));
                break;
        }
        config.resolve.extensions.add('.vue');
        config.module
            .rule('vue')
            .test(/\.vue$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('vue')
            .loader('vue-loader')
            .options(target === 'client'
            ? {}
            : {
                optimizeSSR: true
            });
        config.plugin('vue').use(plugin_1.default);
        config.plugin('define').use(webpack_1.default.DefinePlugin, [
            {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
                'process.env.VUE_ENV': JSON.stringify(target),
                'process.env.GENESIS_NAME': JSON.stringify(ssr.name)
            }
        ]);
    }
}
exports.VuePlugin = VuePlugin;
