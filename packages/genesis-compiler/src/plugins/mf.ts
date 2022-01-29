import { Plugin, WebpackHookParams, CompilerType } from '@fmfe/genesis-core';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import find from 'find';
import write from 'write';

function fixName(name: string) {
    return name.replace(/\W/g, '');
}

export class MFPlugin extends Plugin {
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
                            remotes[item.name] = `${fixName(
                                item.name
                            )}@http://localhost:3001/${
                                item.name
                            }/js/${entryName}.js`;
                        });
                }
            } catch (e) {}
        }
        const name = fixName(ssr.name);

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
