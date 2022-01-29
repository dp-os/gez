import { MF, Plugin, SSR } from '@fmfe/genesis-core';
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
        Object.keys(mf.exposes).forEach((key) => {
            const filename = mf.exposes[key];
            const fullPath = path.isAbsolute(filename)
                ? filename
                : path.resolve(ssr.srcDir, filename);
            exposes[key] = fullPath;
        });
        mf.remotes.forEach((item) => {
            const varName = SSR.fixVarName(item.name);
            const exposesVarName = mf.getWebpackPublicPathVarName(item.name);
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
        config.plugin('module-federation').use(new webpack.container.ModuleFederationPlugin({
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
        const mf = MF.get(ssr);
        const clientVersion = this._getVersion(ssr.outputDirInClient);
        const serverVersion = this._getVersion(ssr.outputDirInServer);
        const files = this._getFiles();
        this._write(mf.outputExposesInfo, {
            clientVersion,
            serverVersion
        });
        this._write(mf.outputExposesFiles, files);
    }
    _write(filename, data) {
        const text = JSON.stringify(data);
        write.sync(filename, text, { newline: true });
    }
    _getVersion(root) {
        const { ssr } = this;
        const mf = MF.get(ssr);
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
