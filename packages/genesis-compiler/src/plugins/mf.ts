import {
    CompilerType,
    MF,
    MFManifestJson,
    Plugin,
    SSR,
    WebpackHookParams
} from '@fmfe/genesis-core';
import crypto from 'crypto';
import fflate from 'fflate';
import find from 'find';
import fs from 'fs';
import path from 'path';
import upath from 'upath';
import webpack from 'webpack';
import write from 'write';

import { relativeFilename } from '../utils';

function getExposes(ssr: SSR, mf: MF) {
    const exposes: Record<string, string> = {};

    Object.keys(mf.options.exposes).forEach((key) => {
        const filename = mf.options.exposes[key];
        const sourceFilename = path.isAbsolute(filename)
            ? filename
            : path.resolve(ssr.baseDir, filename);
        if (!fs.existsSync(sourceFilename)) {
            return;
        }
        const sourceCode = fs.readFileSync(sourceFilename, {
            encoding: 'utf-8'
        });
        const exportDefault = sourceCode.includes('export default');
        const relativePath = relativeFilename(ssr.baseDir, sourceFilename);
        let writeFilename = path.join(ssr.outputDirInTemplate, relativePath);
        const webpackPublicPath: string = relativeFilename(
            writeFilename,
            path.resolve(ssr.outputDirInTemplate, 'webpack-public-path')
        );
        const sourcePath = upath.toUnix(
            relativeFilename(writeFilename, sourceFilename).replace(
                /\.(j|t)s$/,
                ''
            )
        );
        const templateArr: string[] = [
            `import "${upath.toUnix(webpackPublicPath)}";`,
            `export * from "${sourcePath}";`
        ];
        if (exportDefault) {
            templateArr.push(`import source from "${sourcePath}";`);
            templateArr.push('export default source;');
        }
        if (!/\.(j|t)s$/.test(writeFilename)) {
            writeFilename += '.ts';
        }
        write.sync(writeFilename, templateArr.join('\n\r'));

        exposes[key] = writeFilename;
    });
    return exposes;
}

function getRemotes(ssr: SSR, mf: MF, isServer: boolean) {
    const remotes: Record<string, string> = {};

    mf.options.remotes.forEach((item) => {
        const varName = SSR.fixVarName(item.name);
        const exposesVarName = mf.getWebpackPublicPathVarName(item.name);
        if (isServer) {
            const code = `promise (async function () {
var remoteModule = global["${exposesVarName}"];
if (!remoteModule) {
    throw new TypeError("global[\\"${exposesVarName}\\"] does not exist")
}
await remoteModule.fetch(); 
return require(remoteModule.filename);
})();
`;
            remotes[item.name] = code;
            return;
        }
        remotes[item.name] = `promise new Promise(function (resolve, reject) {
    var script = document.createElement("script")
    script.src = window["${exposesVarName}"] ||  window["${ssr.publicPathVarName}"];
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
        };
        resolve(proxy)
    }
    script.onerror = function onerror() {
        document.head.removeChild(script);
        reject(new Error("Load " + script.src + " failed"));
    }
    document.head.appendChild(script);
});
`;
    });

    return remotes;
}
export class MFPlugin extends Plugin {
    public constructor(ssr: SSR) {
        super(ssr);
    }
    public chainWebpack({ config, target }: WebpackHookParams) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const entryName = mf.entryName;

        const name = mf.varName;
        const hash = ssr.isProd ? '.[contenthash:8]' : '';
        const exposes = getExposes(ssr, mf);
        config.plugin('module-federation').use(
            new webpack.container.ModuleFederationPlugin({
                name,
                filename: `js/${entryName}${hash}.js`,
                exposes,
                library:
                    target === 'client'
                        ? undefined
                        : { type: 'commonjs-module' },
                remotes: getRemotes(ssr, mf, target === 'server'),
                shared: mf.options.shared
            })
        );
    }
    public afterCompiler(type: CompilerType) {
        const { ssr } = this;
        const mf = MF.get(ssr);

        if (!mf.haveExposes) return;

        const client = this._getVersion(ssr.outputDirInClient);
        const server = this._getVersion(ssr.outputDirInServer);
        const data: MFManifestJson = {
            c: client,
            s: server,
            d: 0,
            t: Date.now()
        };
        const zipName = server || 'development';
        this._zip(path.resolve(ssr.outputDirInServer), zipName);
        if (mf.options.typesDir) {
            const typeDir = path.resolve(mf.options.typesDir);
            if (fs.existsSync(typeDir)) {
                const packageJsonPath = path.resolve(typeDir, 'package.json');
                this._write(packageJsonPath, {
                    name: ssr.name
                });
                data.d = Number(this._zip(typeDir, `${zipName}-dts`));

                fs.unlinkSync(packageJsonPath);
            }
        }
        this._write(mf.outputManifest, data);
        if (type === 'watch') {
            mf.exposes.emit();
        }
    }
    private _write(filename: string, data: Record<string, any>) {
        write.sync(filename, JSON.stringify(data, null, 4), { newline: true });
    }
    private _zip(baseDir: string, name: string) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const files: Record<string, any> = {};
        find.fileSync(baseDir).forEach((filename: string) => {
            const text = fs.readFileSync(filename);
            files[path.relative(baseDir, filename)] = text;
        });
        if (Object.keys(files).length > 0) {
            const zipped = fflate.zipSync(files);
            write.sync(path.resolve(mf.output, `${name}.zip`), zipped);
            return true;
        }
        return false;
    }
    private _getVersion(root: string) {
        let version = '';
        const filename = this._getFilename(root);
        if (filename) {
            const arr = filename.split('.');
            version = arr[1];
        }

        return version;
    }
    private _getFilename(root: string): string {
        const { ssr } = this;
        const mf = MF.get(ssr);
        let filename = '';
        if (fs.existsSync(root)) {
            const files = find.fileSync(path.resolve(root, './js'));
            const re = new RegExp(`${mf.entryName}\\..{8}.js`);
            filename =
                files.find((filename) => {
                    return re.test(filename);
                }) || '';
        }
        return filename;
    }
}

export function contentHash(text: string) {
    const hash = crypto.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
}
