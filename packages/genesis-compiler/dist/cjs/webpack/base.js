"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConfig = void 0;
const webpack_1 = __importDefault(require("webpack"));
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
class BaseConfig extends utils_1.BaseGenesis {
    constructor(ssr, target) {
        var _a, _b;
        super(ssr);
        const config = this.config = new webpack_chain_1.default();
        config.mode(this.ssr.isProd ? 'production' : 'development');
        config.set('target', ssr.getBrowsers(target));
        config.output.publicPath(target == 'client' ? 'auto' : this.ssr.publicPath);
        config.resolve.extensions.add('.js');
        this.ready = this.ssr.plugin.callHook('chainWebpack', {
            target,
            config
        });
        config.output.pathinfo(false);
        config.stats('errors-warnings');
        const alias = (_b = (_a = ssr.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.alias;
        if (typeof alias === 'object') {
            Object.keys(alias).forEach((k) => {
                const v = alias[k];
                config.resolve.alias.set(k, v);
            });
        }
        let exposes = {};
        let remotes = {};
        if (fs_1.default.existsSync(ssr.mfConfigFile)) {
            const text = fs_1.default.readFileSync(ssr.mfConfigFile, 'utf-8');
            try {
                const data = JSON.parse(text);
                if ('exposes' in data) {
                    Object.keys(data.exposes).forEach(key => {
                        const filename = data.exposes[key];
                        const fullPath = path_1.default.resolve(ssr.srcDir, filename);
                        exposes[key] = fullPath;
                    });
                }
                if ('remotes' in data) {
                    remotes = data.remotes;
                }
            }
            catch (e) { }
        }
        const name = ssr.name.replace(/\W/g, '');
        config.plugin('module-federation').use(new webpack_1.default.container.ModuleFederationPlugin({
            name,
            filename: 'js/exposes.js',
            exposes,
            remotes,
            shared: {
                'vue': {
                    singleton: true
                },
                'vue-router': {
                    singleton: true
                }
            }
        }));
    }
    async toConfig() {
        await this.ready;
        return this.config.toConfig();
    }
}
exports.BaseConfig = BaseConfig;
