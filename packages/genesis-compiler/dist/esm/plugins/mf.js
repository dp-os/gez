import { MF, Plugin, SSR } from '@fmfe/genesis-core';
import crypto from 'crypto';
import fflate from 'fflate';
import find from 'find';
import fs from 'fs';
import path from 'path';
import upath from 'upath';
import webpack from 'webpack';
import write from 'write';
import { relativeFilename } from '../utils';
function getExposes(ssr, mf) {
    const exposes = {};
    Object.keys(mf.options.exposes).forEach((key) => {
        const filename = mf.options.exposes[key];
        const sourceFilename = path.isAbsolute(filename)
            ? filename
            : path.resolve(ssr.srcDir, filename);
        const relativePath = relativeFilename(ssr.srcDir, sourceFilename);
        const writeFilename = path.join(ssr.outputDirInTemplate, relativePath);
        const webpackPublicPath = relativeFilename(writeFilename, path.resolve(ssr.outputDirInTemplate, 'webpack-public-path'));
        const template = `import "${upath.toUnix(webpackPublicPath)}";
export * from "${relativeFilename(writeFilename, sourceFilename)}";`;
        write.sync(writeFilename, template);
        exposes[key] = writeFilename;
    });
    return exposes;
}
function getRemotes(mf, isServer) {
    const remotes = {};
    mf.options.remotes.forEach((item) => {
        const varName = SSR.fixVarName(item.name);
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
export class MFPlugin extends Plugin {
    constructor(ssr) {
        super(ssr);
    }
    chainWebpack({ config, target }) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const entryName = mf.entryName;
        const name = mf.name;
        const hash = ssr.isProd ? '.[contenthash:8]' : '';
        const exposes = getExposes(ssr, mf);
        config.plugin('module-federation').use(new webpack.container.ModuleFederationPlugin({
            name,
            filename: `js/${entryName}${hash}.js`,
            exposes,
            library: target === 'client'
                ? undefined
                : { type: 'commonjs-module' },
            remotes: getRemotes(mf, target === 'server'),
            shared: mf.options.shared
        }));
    }
    afterCompiler(type) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        if (!mf.haveExposes)
            return;
        const client = this._getVersion(ssr.outputDirInClient);
        const server = this._getVersion(ssr.outputDirInServer);
        const data = {
            client,
            server,
            createTime: Date.now()
        };
        this._write(mf.outputManifest, data);
        this._zip(server || 'development');
        if (type === 'watch') {
            mf.exposes.emit();
        }
    }
    _write(filename, data) {
        write.sync(filename, JSON.stringify(data, null, 4), { newline: true });
    }
    _zip(version) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const files = {};
        find.fileSync(path.resolve(ssr.outputDirInServer, './js')).forEach((filename) => {
            const text = fs.readFileSync(filename);
            files[path.basename(filename)] = text;
        });
        const zipped = fflate.zipSync(files);
        write.sync(path.resolve(mf.output, `${version}.zip`), zipped);
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
    _getFilename(root) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        let filename = '';
        if (fs.existsSync(root)) {
            const files = find.fileSync(path.resolve(root, './js'));
            const re = new RegExp(`${mf.entryName}\\..{8}.js`);
            filename = files.find((filename) => {
                return re.test(filename);
            });
        }
        return filename;
    }
}
export function contentHash(text) {
    const hash = crypto.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
}
