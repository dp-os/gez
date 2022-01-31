import {
    CompilerType,
    MF,
    Plugin,
    SSR,
    WebpackHookParams
} from '@fmfe/genesis-core';
import find from 'find';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import write from 'write';

export class MFPlugin extends Plugin {
    public constructor(ssr: SSR) {
        super(ssr);
    }
    public chainWebpack({ config, target }: WebpackHookParams) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const exposes: Record<string, string> = {};
        const entryName = mf.entryName;
        const remotes: Record<string, string> = {};

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
            if (target === 'server' && item.name === 'ssr-home') {
                remotes[
                    item.name
                ] = `promise new Promise(function(resolve) {resolve(require(global["${exposesVarName}"]))})`;
                return;
            }
            remotes[
                item.name
            ] = `promise new Promise(function (resolve, reject) {
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

        config.plugin('module-federation').use(
            new webpack.container.ModuleFederationPlugin({
                name,
                filename: ssr.isProd
                    ? `js/${entryName}.[contenthash:8].js`
                    : `js/${entryName}.js`,
                exposes,
                library:
                    target === 'client'
                        ? undefined
                        : { type: 'commonjs-module' },
                remotes,
                shared: {
                    vue: {
                        singleton: true
                    },
                    'vue-router': {
                        singleton: true
                    }
                }
            })
        );
    }
    public afterCompiler(type: CompilerType) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const clientVersion = this._getVersion(ssr.outputDirInClient);
        const serverVersion = this._getVersion(ssr.outputDirInServer);
        const files = this._getFiles();
        this._write(mf.outputExposesVersion, [
            clientVersion,
            serverVersion,
            ssr.isProd
        ]);
        this._write(mf.outputExposesFiles, files);
    }
    private _write(filename: string, data: any) {
        const text = JSON.stringify(data);
        write.sync(filename, text, { newline: true });
    }

    private _getVersion(root: string) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        let version = String(Date.now());
        const filename = this._getFilename(root);
        if (filename) {
            const arr = filename.split('.');
            version = arr[1];
        }

        return version;
    }
    private _getFiles() {
        const { ssr } = this;
        const files = {};
        find.fileSync(path.resolve(ssr.outputDirInServer, './js')).forEach(
            (filename) => {
                const text = fs.readFileSync(filename, 'utf-8');
                const key = path.relative(ssr.outputDirInServer, filename);
                files[key] = text;
            }
        );
        return files;
    }
    private _getFilename(root: string): string {
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
