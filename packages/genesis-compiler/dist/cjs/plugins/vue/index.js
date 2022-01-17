"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VuePlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const plugin_1 = __importDefault(require("vue-loader/lib/plugin"));
const client_plugin_1 = __importDefault(require("vue-server-renderer/client-plugin"));
const server_plugin_1 = __importDefault(require("vue-server-renderer/server-plugin"));
const webpack_1 = __importDefault(require("webpack"));
const write_1 = __importDefault(require("write"));
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
                config.plugin('vue-ssr-server').use(new server_plugin_1.default({
                    filename: path_1.default.relative(ssr.outputDirInServer, ssr.outputServerBundleFile)
                }));
                config.plugin('import-url').use(new webpack_1.default.ProvidePlugin({
                    URL: ['url', 'URL']
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
                'process.env.VUE_ENV': JSON.stringify(target),
                'process.env.GENESIS_NAME': JSON.stringify(ssr.name)
            }
        ]);
    }
    afterCompiler(type) {
        if (type === 'build') {
            const text = fs_1.default.readFileSync(this.ssr.outputServerBundleFile, 'utf8');
            const data = JSON.parse(text);
            const files = data.files;
            Object.keys(files).forEach(name => {
                const fullPath = path_1.default.resolve(this.ssr.outputDirInServer, './js', name);
                write_1.default.sync(fullPath, files[name]);
            });
        }
    }
}
exports.VuePlugin = VuePlugin;
