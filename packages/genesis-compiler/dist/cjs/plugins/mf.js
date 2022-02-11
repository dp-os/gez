"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentHash = exports.MFPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const crypto_1 = __importDefault(require("crypto"));
const find_1 = __importDefault(require("find"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const upath_1 = __importDefault(require("upath"));
const webpack_1 = __importDefault(require("webpack"));
const write_1 = __importDefault(require("write"));
const utils_1 = require("../utils");
function getExposes(ssr, mf) {
    const exposes = {};
    Object.keys(mf.options.exposes).forEach((key) => {
        const filename = mf.options.exposes[key];
        const sourceFilename = path_1.default.isAbsolute(filename)
            ? filename
            : path_1.default.resolve(ssr.srcDir, filename);
        const relativePath = (0, utils_1.relativeFilename)(ssr.srcDir, sourceFilename);
        const writeFilename = path_1.default.join(ssr.outputDirInTemplate, relativePath);
        const webpackPublicPath = (0, utils_1.relativeFilename)(writeFilename, path_1.default.resolve(ssr.outputDirInTemplate, 'webpack-public-path'));
        const template = `import "${upath_1.default.toUnix(webpackPublicPath)}";
export * from "${(0, utils_1.relativeFilename)(writeFilename, sourceFilename)}";`;
        write_1.default.sync(writeFilename, template);
        exposes[key] = writeFilename;
    });
    return exposes;
}
function getRemotes(mf, isServer) {
    const remotes = {};
    mf.options.remotes.forEach((item) => {
        const varName = genesis_core_1.SSR.fixVarName(item.name);
        const exposesVarName = mf.getWebpackPublicPathVarName(item.name);
        if (isServer) {
            const code = `promise (async function () {
var remoteModule = global["${exposesVarName}"];
await remoteModule.init(); 
return require(remoteModule.filename);
})();
`;
            remotes[item.name] = code;
            return;
        }
        remotes[item.name] = `promise new Promise(function (resolve, reject) {
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
            script.onerror = function onerror() {

                document.head.removeChild(script);
            }
            document.head.appendChild(script);
          })
          `;
    });
    return remotes;
}
class MFPlugin extends genesis_core_1.Plugin {
    constructor(ssr) {
        super(ssr);
    }
    chainWebpack({ config, target }) {
        const { ssr } = this;
        const mf = genesis_core_1.MF.get(ssr);
        const entryName = mf.entryName;
        const name = mf.name;
        const hash = ssr.isProd ? '.[contenthash:8]' : '';
        config.plugin('module-federation').use(new webpack_1.default.container.ModuleFederationPlugin({
            name,
            filename: `js/${entryName}${hash}.js`,
            exposes: getExposes(ssr, mf),
            library: target === 'client'
                ? undefined
                : { type: 'commonjs-module' },
            remotes: getRemotes(mf, target === 'server'),
            shared: mf.options.shared
        }));
    }
    afterCompiler(type) {
        const { ssr } = this;
        const mf = genesis_core_1.MF.get(ssr);
        const clientVersion = this._getVersion(ssr.outputDirInClient);
        const serverVersion = this._getVersion(ssr.outputDirInServer);
        const files = this._getFiles();
        const data = {
            version: contentHash(JSON.stringify(files)),
            clientVersion,
            serverVersion,
            files
        };
        const text = JSON.stringify(data);
        this._write(mf.outputExposesVersion, data.version);
        this._write(mf.outputExposesFiles, text);
        if (type === 'watch') {
            mf.exposes.emit();
        }
    }
    _write(filename, text) {
        write_1.default.sync(filename, text, { newline: true });
    }
    _getVersion(root) {
        let version = '';
        const filename = this._getFilename(root);
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
    _getFilename(root) {
        const { ssr } = this;
        const mf = genesis_core_1.MF.get(ssr);
        let filename = '';
        if (fs_1.default.existsSync(root)) {
            const files = find_1.default.fileSync(path_1.default.resolve(root, './js'));
            const re = new RegExp(`${mf.entryName}\\..{8}.js`);
            filename = files.find((filename) => {
                return re.test(filename);
            });
        }
        return filename;
    }
}
exports.MFPlugin = MFPlugin;
function contentHash(text) {
    const hash = crypto_1.default.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
}
exports.contentHash = contentHash;
