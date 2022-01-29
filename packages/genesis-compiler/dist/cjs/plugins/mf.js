"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MFPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const find_1 = __importDefault(require("find"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const write_1 = __importDefault(require("write"));
class MFPlugin extends genesis_core_1.Plugin {
    constructor(ssr) {
        super(ssr);
    }
    chainWebpack({ config, target }) {
        const { ssr } = this;
        const mf = genesis_core_1.MF.get(ssr);
        const exposes = {};
        const entryName = mf.entryName;
        const remotes = {};
        Object.keys(mf.exposes).forEach((key) => {
            const filename = mf.exposes[key];
            const fullPath = path_1.default.isAbsolute(filename)
                ? filename
                : path_1.default.resolve(ssr.srcDir, filename);
            exposes[key] = fullPath;
        });
        mf.remotes.forEach((item) => {
            const varName = mf.name;
            const exposesVarName = mf.getVarName(item.name);
            remotes[item.name] = `promise new Promise(resolve => {
                var script = document.createElement('script')
                script.src = window["${exposesVarName}"];
                script.onload = function onload() {
                  var proxy = {
                    get: (request) => window["${varName}"].get(request),
                    init: (arg) => {
                      try {
                        return window["${varName}"].init(arg)
                      } catch(e) {
                        console.log('remote container already initialized')
                      }
                    }
                  }
                  resolve(proxy)
                }
                document.head.appendChild(script);
              })
              `;
        });
        const name = mf.name;
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
    afterCompiler(type) {
        const { ssr } = this;
        const mf = genesis_core_1.MF.get(ssr);
        const clientVersion = this._getVersion(ssr.outputDirInClient);
        const serverVersion = this._getVersion(ssr.outputDirInServer);
        const files = this._getFiles();
        const version = clientVersion + serverVersion;
        const text = JSON.stringify({
            version,
            clientVersion,
            serverVersion,
            files
        }, null, 4);
        write_1.default.sync(path_1.default.resolve(ssr.outputDirInServer, `${mf.entryName}.json`), text, { newline: true });
    }
    _getVersion(root) {
        const { ssr } = this;
        const mf = genesis_core_1.MF.get(ssr);
        let version = '';
        const files = find_1.default.fileSync(path_1.default.resolve(root, './js'));
        const re = new RegExp(`${mf.entryName}\\..{8}.js`);
        const filename = files.find((filename) => {
            return re.test(filename);
        });
        if (filename) {
            const arr = filename.split('.');
            version = arr[1];
        }
        return version;
    }
    _getFiles() {
        const { ssr } = this;
        const files = {};
        find_1.default.fileSync(path_1.default.resolve(ssr.outputDirInServer, './js')).forEach((filename) => {
            const text = fs_1.default.readFileSync(filename, 'utf-8');
            const key = path_1.default.relative(ssr.outputDirInServer, filename);
            files[key] = text;
        });
        return files;
    }
}
exports.MFPlugin = MFPlugin;
