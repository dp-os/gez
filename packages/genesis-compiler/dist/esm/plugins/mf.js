import { MF, Plugin, SSR } from '@fmfe/genesis-core';
import crypto from 'crypto';
import find from 'find';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import write from 'write';
export class MFPlugin extends Plugin {
    constructor(ssr) {
        super(ssr);
    }
    chainWebpack({ config, target }) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const exposes = {};
        const entryName = mf.entryName;
        const remotes = {};
        Object.keys(mf.options.exposes).forEach((key) => {
            const filename = mf.options.exposes[key];
            const fullPath = path.isAbsolute(filename)
                ? filename
                : path.resolve(ssr.srcDir, filename);
            exposes[key] = fullPath;
        });
        mf.options.remotes.forEach((item) => {
            const varName = SSR.fixVarName(item.name);
            const exposesVarName = mf.getWebpackPublicPathVarName(item.name);
            if (target === 'server') {
                const code = `promise (async function () { return global["${exposesVarName}"].init(module); })();`;
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
        const name = mf.name;
        config.plugin('module-federation').use(new webpack.container.ModuleFederationPlugin({
            name,
            filename: ssr.isProd
                ? `js/${entryName}.[contenthash:8].js`
                : `js/${entryName}.js`,
            exposes,
            library: target === 'client'
                ? undefined
                : { type: 'commonjs-module' },
            remotes,
            shared: mf.options.shared
        }));
    }
    afterCompiler(type) {
        const { ssr } = this;
        const mf = MF.get(ssr);
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
        write.sync(filename, text, { newline: true });
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
        find.fileSync(path.resolve(ssr.outputDirInServer, './js')).forEach((filename) => {
            const text = fs.readFileSync(filename, 'utf-8');
            const key = path.relative(ssr.outputDirInServer, filename);
            files[key] = text;
        });
        return files;
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
