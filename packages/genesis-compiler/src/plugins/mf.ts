import { Plugin, WebpackHookParams, CompilerType, MF, SSR } from '@fmfe/genesis-core';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import find from 'find';
import write from 'write';

export class MFPlugin extends Plugin {
    public constructor (ssr: SSR) {
        super(ssr);
    }
    public chainWebpack({ config, target }: WebpackHookParams) {
        const { ssr } = this;
        const exposes: Record<string, string> = {};
        const entryName = this.ssr.exposesEntryName;
        const remotes: Record<string, string> = {};
        if (fs.existsSync(ssr.mfConfigFile)) {
            const text = fs.readFileSync(ssr.mfConfigFile, 'utf-8');
            try {
                const data: Record<string, any> = JSON.parse(text);
                if ('exposes' in data) {
                    Object.keys(data.exposes).forEach((key) => {
                        const filename = data.exposes[key];
                        const fullPath = path.resolve(ssr.srcDir, filename);
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
                            const varName = MF.varName(ssr.name,);
                            const exposesVarName = MF.exposesVarName(ssr.name, item.name);
                            remotes[item.name] =  `promise new Promise(resolve => {
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
                }
            } catch (e) {}
        }
        const name = MF.varName(ssr.name);

        config.plugin('module-federation').use(
            new webpack.container.ModuleFederationPlugin({
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
            })
        );
    }
    public afterCompiler (type: CompilerType) {
        const { ssr } = this;
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
        write.sync(path.resolve(ssr.outputDirInServer, `${ssr.exposesEntryName}.json`), text, { newline: true })
    }

    private _getVersion(root: string) {
        const { ssr } = this;
        let version = '';
        const files = find.fileSync(path.resolve(root, './js'));
        const re = new RegExp(`${ssr.exposesEntryName}\..{8}\.js`)
        const filename = files.find(filename => {
            return re.test(filename);
        });
        if (filename) {
            const arr = filename.split('.');
            version = arr[1];
        }
        return version;
    }
    private _getFiles() {
        const { ssr } = this;
        const files = {};
        find.fileSync(path.resolve(ssr.outputDirInServer, './js')).forEach(filename => {
            const text = fs.readFileSync(filename, 'utf-8');
            const key = path.relative(ssr.outputDirInServer, filename);
            files[key] = text;
        })
        return files;
    }
}
