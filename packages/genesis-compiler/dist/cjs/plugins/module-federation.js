"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleFederationPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
function fixName(name) {
    return name.replace(/\W/g, '');
}
class ModuleFederationPlugin extends genesis_core_1.Plugin {
    chainWebpack({ config, target }) {
        const { ssr } = this;
        const exposes = {};
        const entryName = this.ssr.exposesEntryName;
        const remotes = {};
        if (fs_1.default.existsSync(ssr.mfConfigFile)) {
            const text = fs_1.default.readFileSync(ssr.mfConfigFile, 'utf-8');
            try {
                const data = JSON.parse(text);
                if ('exposes' in data) {
                    Object.keys(data.exposes).forEach((key) => {
                        const filename = data.exposes[key];
                        const fullPath = path_1.default.resolve(ssr.srcDir, filename);
                        exposes[key] = fullPath;
                    });
                }
                if (Array.isArray(data.remotes)) {
                    data.remotes
                        .map((item) => {
                        return {
                            name: item
                        };
                    })
                        .forEach((item) => {
                        remotes[item.name] = `${fixName(item.name)}@http://localhost:3001/${item.name}/js/${entryName}.js`;
                    });
                }
            }
            catch (e) { }
        }
        const name = fixName(ssr.name);
        config.plugin('module-federation').use(new webpack_1.default.container.ModuleFederationPlugin({
            name,
            filename: ssr.isProd
                ? `js/${entryName}.[contenthash:8].js`
                : `js/${entryName}.js`,
            exposes,
            remotes,
            shared: {
                vue: {
                    singleton: true
                },
                'vue-router': {
                    singleton: true
                }
            }
        }));
    }
}
exports.ModuleFederationPlugin = ModuleFederationPlugin;
