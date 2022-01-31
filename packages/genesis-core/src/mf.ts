import fs from 'fs';
import http from 'http';
import path from 'path';
import serialize from 'serialize-javascript';
import write from 'write';

import type * as Genesis from '.';
import { Plugin } from './plugin';
import { SSR } from './ssr';

const mf = Symbol('mf');
const separator = '-';

class Remote {
    public ssr: Genesis.SSR;
    public options: Genesis.MFRemote;
    public version = '';
    public clientVersion = '';
    public serverVersion = '';
    public constructor(ssr: Genesis.SSR, options: Genesis.MFRemote) {
        this.ssr = ssr;
        this.options = options;
    }
    public get mf() {
        return MF.get(this.ssr);
    }
    public parse(version: string) {
        const arr: string[] = version.split(separator);
        if (arr.length === 3) {
            this.version = version;
            if (arr[2] === 'true') {
                this.clientVersion = arr[0];
                this.serverVersion = arr[1];
                return;
            }
        }
        this.clientVersion = '';
        this.serverVersion = '';
    }
    public async get() {
        const { name } = this.options;
        const { mf } = this;
        let serverUrl = this.options.serverUrl;
        serverUrl += serverUrl.includes('?') ? '&' : '?';
        serverUrl += `version=${this.version}`;
        const res = await new Promise<{
            version: string;
            files: Record<string, string>;
        }>((resolve, reject) => {
            http.get(serverUrl, (data) => {
                let str = '';
                data.on('data', (chunk: string) => {
                    str += chunk;
                });
                data.on('end', () => {
                    resolve(JSON.parse(str));
                });
                data.once('error', (err: unknown) => {
                    reject(err);
                });
            });
        });
        if (res.version === this.version) return;
        this.parse(res.version);
        Object.keys(res.files).forEach((file) => {
            const text = res.files[file];
            const fullPath = path.resolve(
                this.ssr.outputDirInServer,
                `remotes/${name}/${file}`
            );
            write.sync(fullPath, text);
        });
        const { serverVersion } = this;
        const varName = mf.getWebpackPublicPathVarName(name);
        const version = serverVersion ? `.${serverVersion}` : '';
        global[varName] = path.resolve(
            this.ssr.outputDirInServer,
            `remotes/${name}/js/${mf.entryName}${version}.js`
        );
    }
    public inject() {
        const { name, publicPath } = this.options;
        const { clientVersion, mf } = this;
        const version = clientVersion ? `.${clientVersion}` : '';
        const fullPath =
            publicPath + `/${name}/js/${mf.entryName}${version}.js`;
        const value = serialize(fullPath);
        const varName = mf.getWebpackPublicPathVarName(name);

        return `window["${varName}"] = ${value};`;
    }
}

class Exposes {
    public ssr: Genesis.SSR;
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
    }
    public get mf() {
        return MF.get(this.ssr);
    }
    public async get(version = '') {
        const res = { version: '', files: {} };
        res.version = this.read(this.mf.outputExposesVersion).join(separator);
        if (res.version !== version) {
            res.files = this.read(this.mf.outputExposesFiles);
        }

        return res;
    }
    public read(fullPath: string) {
        if (!fs.existsSync(fullPath)) {
            throw new Error(`${fullPath} file not found`);
        }
        const text = fs.readFileSync(fullPath, { encoding: 'utf-8' });

        return JSON.parse(text);
    }
}

export class MFPlugin extends Plugin {
    public remotes: Remote[];
    public constructor(ssr: Genesis.SSR) {
        super(ssr);
        const mf = MF.get(ssr);
        this.remotes = mf.options.remotes.map(
            (options) => new Remote(ssr, options)
        );
    }
    public getRemote() {
        return Promise.all(
            this.remotes.map((item) => {
                return item.get();
            })
        );
    }
    public renderBefore(context: Genesis.RenderContext): void {
        const { remotes } = this;
        if (remotes.length) {
            const arr = remotes.map((item) => {
                return item.inject();
            });
            context.data.script += `<script>${arr.join('')}</script>`;
        }
    }
}

export class MF {
    public static is(ssr: Genesis.SSR) {
        return ssr[mf] instanceof MF;
    }
    public static get(ssr: Genesis.SSR): MF {
        return ssr[mf]!;
    }
    public options: Required<Genesis.MFOptions> = { remotes: [], exposes: {} };
    public entryName = 'exposes';
    protected ssr: Genesis.SSR;
    protected mfPlugin: MFPlugin;
    protected exposes: Exposes;
    public constructor(ssr: Genesis.SSR, options: Genesis.MFOptions = {}) {
        this.ssr = ssr;
        Object.assign(this.options, options);
        ssr[mf] = this;
        this.mfPlugin = new MFPlugin(ssr);
        this.exposes = new Exposes(ssr);
        ssr.plugin.use(this.mfPlugin);
    }
    public get name() {
        return SSR.fixVarName(this.ssr.name);
    }
    public get outputExposesVersion() {
        return path.resolve(
            this.ssr.outputDirInServer,
            'vue-ssr-server-exposes-version.json'
        );
    }
    public get outputExposesFiles() {
        return path.resolve(
            this.ssr.outputDirInServer,
            'vue-ssr-server-exposes-files.json'
        );
    }
    public getWebpackPublicPathVarName(name: string) {
        return `__webpack_public_path_${this.name}_${SSR.fixVarName(name)}`;
    }
    public getExposes(version: string) {
        return this.exposes.get(version);
    }
    public getRemote() {
        return this.mfPlugin.getRemote();
    }
}
