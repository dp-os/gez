import axios from 'axios';
import del from 'del';
import fflate from 'fflate';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import serialize from 'serialize-javascript';
import write from 'write';

import type * as Genesis from '.';
import { Plugin } from './plugin';
import type { Renderer } from './renderer';
import { SSR } from './ssr';

const mf = Symbol('mf');
const entryDirName = 'node-exposes';
const manifestJsonName = 'manifest.json';
const developmentZipName = 'development';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _startTime?: number;
        loggerText?: string;
    }
}

class Logger {
    public static requestFailed(url: string) {
        return this.log(`${url} request failed`);
    }
    public static decompressionFailed(url: string) {
        return this.log(`${url} decompression failed`);
    }
    public static reload(url: string) {
        return this.log(`Hot update to ${url} code`);
    }
    public static readCache(url: string) {
        return this.log(`${url} read local cache`);
    }
    public static ready(name: string) {
        return this.log(`${name} is ready`);
    }
    public static log(text: string) {
        return console.log(`[@fmfe/genesis-core] ${text}`);
    }
}

const reZip = /\.zip$/;
function createRequest() {
    const request = axios.create({
        httpAgent: new http.Agent({ keepAlive: true }),
        httpsAgent: new https.Agent({ keepAlive: true })
    });
    request.interceptors.request.use((axiosConfig) => {
        axiosConfig._startTime = Date.now();
        return axiosConfig;
    });

    request.interceptors.response.use(
        async (axiosConfig) => {
            const time = Date.now() - axiosConfig.config._startTime;
            const url = axiosConfig.config.url || '';
            if (reZip.test(url)) {
                Logger.log(`${url} download ${time}ms`);
            }
            return Promise.resolve(axiosConfig);
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    return request;
}

interface ManifestJson {
    /**
     * client
     */
    c: string;
    /**
     * server
     */
    s: string;
    /**
     * dts
     */
    d: 0 | 1;
    /**
     * create time
     */
    t: number;
}

class RemoteModule {
    public remote: Remote;
    public constructor(remote: Remote) {
        this.remote = remote;
        const { ssr } = remote;
        Object.defineProperty(ssr.sandboxGlobal, this.varName, {
            enumerable: true,
            get: () => this
        });
        Object.defineProperty(
            ssr.sandboxGlobal,
            SSR.getPublicPathVarName(remote.options.name),
            {
                enumerable: true,
                get: () => this.remote.clientPublicPath
            }
        );
    }
    public get varName() {
        const { mf, options } = this.remote;
        const name = options.name;
        const varName = mf.getWebpackPublicPathVarName(name);
        return varName;
    }
    public get filename() {
        const { manifest, mf, baseDir } = this.remote;
        const version = manifest.s ? `.${manifest.s}` : '';

        return path.resolve(baseDir, `js/${mf.entryName}${version}.js`);
    }
    public async fetch() {
        if (this.remote.ready.loading) {
            const success = await this.remote.fetch();
            if (!success) {
                throw new Error(
                    `${this.remote.options.name} remote module download failed`
                );
            }
        }
    }
    public destroy() {
        delete global[this.varName];
    }
}

function createManifest(): ManifestJson {
    return {
        c: '',
        s: '',
        t: 0,
        d: 0
    };
}

class Json<T> {
    public filename: string;
    public data: T;
    private _data: () => T;
    public constructor(filename: string, _data: () => T) {
        this.filename = filename;
        this._data = _data;
        this.data = this.get();
    }
    public get haveCache() {
        const { filename } = this;
        return fs.existsSync(filename);
    }
    public get(): T {
        if (this.haveCache) {
            const text = fs.readFileSync(this.filename, { encoding: 'utf-8' });
            return JSON.parse(text);
        }
        this.data = this._data();
        return this.data;
    }
    public set(data: T) {
        this.data = data;
        const text = JSON.stringify(data, null, 4);
        write.sync(this.filename, text);
    }
}

/**
 * 下载对应的ZIP文件
 */
class RemoteZip {
    private url: string;
    private writeDir: string;
    private remote: Remote;
    private info: Json<{ version: string }>;
    private version: string;
    private clean: boolean;
    public constructor({
        remote,
        writeDir,
        url,
        version,
        clean
    }: {
        remote: Remote;
        writeDir: string;
        url: string;
        version: string;
        clean: boolean;
    }) {
        this.remote = remote;
        this.writeDir = writeDir;
        this.url = url;
        this.version = version;
        this.clean = clean;
        this.info = new Json(path.resolve(writeDir, '.remote.json'), () => ({
            version: ''
        }));
    }
    public async download(): Promise<{
        ok: boolean;
        code: 'no-update' | 'error' | 'remote' | 'local';
    }> {
        const { info } = this;
        // 如果和版本号一致，则不需要下载
        if (info.haveCache && info.data.version === this.version) {
            return {
                ok: true,
                code: 'no-update'
            };
        }
        const { writeDir, remote } = this;
        const zipU8: Uint8Array | null = await remote.request
            .get(this.url, { responseType: 'arraybuffer' })
            .then((res) => res.data)
            .catch(() => null);
        if (!zipU8) {
            return {
                ok: false,
                code: 'error'
            };
        }
        if (this.clean) {
            del.sync(this.writeDir);
        }
        let files: Record<string, any> = {};
        try {
            files = fflate.unzipSync(zipU8);
        } catch (e) {
            Logger.decompressionFailed(this.url);
            return {
                ok: false,
                code: 'error'
            };
        }
        Object.keys(files).forEach((name) => {
            write.sync(path.resolve(writeDir, name), files[name]);
        });
        info.set({
            version: this.version
        });
        return {
            ok: true,
            code: 'remote'
        };
    }
}

class Remote {
    public ssr: Genesis.SSR;
    public options: Genesis.MFRemote;
    public ready = new ReadyPromise<true>();
    private remoteModule: RemoteModule;
    private renderer?: Renderer;
    private timer?: NodeJS.Timeout;
    private already = false;
    public request = createRequest();
    private manifestJson: Json<ManifestJson>;
    public constructor(ssr: Genesis.SSR, options: Genesis.MFRemote) {
        this.ssr = ssr;
        this.options = options;
        this.remoteModule = new RemoteModule(this);
        this.polling = this.polling.bind(this);
        this.manifestJson = new Json<ManifestJson>(
            path.resolve(this.writeBaseDir, 'manifest.json'),
            createManifest
        );
        if (ssr.isProd && this.manifest.s) {
            this.downloadZip(this.manifest);
        }
    }
    public get manifest() {
        return this.manifestJson.data;
    }
    public get mf() {
        return MF.get(this.ssr);
    }
    public get clientPublicPath() {
        return `${this.options.clientOrigin}/${this.options.name}/`;
    }
    public get serverPublicPath() {
        return `${this.options.serverOrigin}/${this.options.name}/`;
    }
    public get baseDir() {
        return this.getWrite(this.manifest.s);
    }
    public get writeBaseDir() {
        return path.resolve(
            this.ssr.outputDirInServer,
            `remotes/${this.options.name}`
        );
    }
    public async init(renderer?: Renderer) {
        if (renderer) {
            this.renderer = renderer;
        }
        if (!this.already) {
            this.already = true;
            this.polling();
        }
        await this.ready.await;
    }
    public getWrite(server: string) {
        const baseName = server || developmentZipName;
        return path.resolve(this.writeBaseDir, baseName);
    }
    public async fetch(): Promise<boolean> {
        const { manifest, serverPublicPath } = this;
        const nowTime = Date.now();
        const url = `${serverPublicPath}${entryDirName}/${manifestJsonName}?t=${manifest.t}&n=${nowTime}`;
        const res: ManifestJson = await this.request
            .get(url)
            .then((res) => res.data)
            .catch(() => null);
        if (res && typeof res === 'object') {
            return this.downloadZip(res);
        } else {
            Logger.requestFailed(url);
        }
        return false;
    }
    private getTargetUrl(target: string) {
        const { serverPublicPath } = this;
        return `${serverPublicPath}${entryDirName}/${target}`;
    }
    private async downloadZip(manifest: ManifestJson): Promise<boolean> {
        let url: string;
        const writeDir: string = this.getWrite(manifest.s);
        let version: string;
        let clean: boolean;
        // 是生产环境包
        if (manifest.s) {
            url = this.getTargetUrl(`${manifest.s}.zip`);
            version = manifest.s;
            clean = false;
        } else {
            url = this.getTargetUrl(`${developmentZipName}.zip`);
            version = String(manifest.t);
            clean = true;
        }
        const zip = new RemoteZip({
            remote: this,
            url,
            writeDir,
            version,
            clean
        });
        const { ok, code } = await zip.download();
        const { ready } = this;
        if (!ok) return false;
        this.manifestJson.set(manifest);
        if (code === 'local' || (ready.loading && code === 'no-update')) {
            Logger.readCache(url);
        }
        if (code !== 'no-update') {
            Logger.reload(url);
            this.renderer?.reload();
        }
        if (ready.loading) {
            Logger.ready(this.options.name);
            ready.finish(true);
        }
        return true;
    }
    private async polling() {
        const { mf } = this;
        await this.fetch();
        this.timer = setTimeout(this.polling, mf.options.intervalTime);
    }
    public destroy() {
        this.timer && clearTimeout(this.timer);
        this.remoteModule.destroy();
    }
    public inject() {
        const { name } = this.options;
        const { manifest, mf, clientPublicPath } = this;
        let scriptText = '';
        const appendScript = (varName: string, value: string) => {
            const val = serialize(value);
            scriptText += `window["${varName}"] = ${val};`;
        };
        const version = manifest.c ? `.${manifest.c}` : '';
        const fullPath = `${clientPublicPath}js/${mf.entryName}${version}.js`;

        appendScript(mf.getWebpackPublicPathVarName(name), fullPath);
        appendScript(SSR.getPublicPathVarName(name), clientPublicPath);

        return scriptText;
    }
}

class RemoteGroup {
    private items: Remote[];
    private ssr: SSR;
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
        this.items = this.mf.options.remotes.map(
            (opts) => new Remote(ssr, opts)
        );
    }
    public get mf() {
        return MF.get(this.ssr);
    }
    public inject() {
        const { items } = this;
        if (!items.length) {
            return '';
        }
        const arr = items.map((item) => {
            return item.inject();
        });
        return `<script>${arr.join('')}</script>`;
    }
    public init(...args: Parameters<Remote['init']>) {
        return Promise.all(this.items.map((item) => item.init(...args)));
    }
    public fetch() {
        return Promise.all(this.items.map((item) => item.fetch()));
    }
}

type ExposesWatchCallback = () => void;

class Exposes {
    public ssr: Genesis.SSR;
    private subs: ExposesWatchCallback[] = [];
    private manifestJson: Json<ManifestJson>;
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
        this.manifestJson = new Json(this.mf.outputManifest, createManifest);
    }
    public get mf() {
        return MF.get(this.ssr);
    }
    public get manifest() {
        return this.manifestJson.data;
    }
    public watch(cb: ExposesWatchCallback) {
        const wrap = () => {
            return cb();
        };
        this.subs.push(wrap);
        return () => {
            const index = this.subs.indexOf(wrap);
            if (index > -1) {
                this.subs.splice(index, 1);
            }
        };
    }
    public getManifest(t = 0, maxAwait = 1000 * 60): Promise<ManifestJson> {
        if (!t || t !== this.manifest.t) {
            return Promise.resolve({ ...this.manifest });
        }
        return new Promise<ManifestJson>((resolve) => {
            const timer = setTimeout(() => {
                resolve({ ...this.manifest });
            }, maxAwait);
            this.watch(() => {
                clearTimeout(timer);
                resolve({ ...this.manifest });
            });
        });
    }
    public emit() {
        this.manifestJson.get();
        this.subs.forEach((cb) => cb());
    }
}

export class MFPlugin extends Plugin {
    public constructor(ssr: Genesis.SSR) {
        super(ssr);
    }
    public get mf() {
        return MF.get(this.ssr);
    }
    public renderBefore(context: Genesis.RenderContext): void {
        context.data.script += this.mf.remote.inject();
    }
}

export class MF {
    public static is(ssr: Genesis.SSR) {
        return ssr[mf] instanceof MF;
    }
    public static get(ssr: Genesis.SSR): MF {
        if (!this.is(ssr)) {
            throw new TypeError(`SSR instance: MF instance not found`);
        }
        return ssr[mf];
    }
    public options: Required<Genesis.MFOptions> = {
        remotes: [],
        intervalTime: 1000,
        exposes: {},
        shared: {},
        typesDir: ''
    };
    public exposes: Exposes;
    public remote: RemoteGroup;
    public entryName = 'exposes';
    protected ssr: Genesis.SSR;
    protected mfPlugin: MFPlugin;
    public constructor(ssr: Genesis.SSR, options: Genesis.MFOptions = {}) {
        this.ssr = ssr;
        Object.assign(this.options, options);
        ssr[mf] = this;
        this.mfPlugin = new MFPlugin(ssr);
        this.exposes = new Exposes(ssr);
        this.remote = new RemoteGroup(ssr);
        ssr.plugin.use(this.mfPlugin);
        if (ssr.options?.build?.extractCSS !== false) {
            throw new TypeError(
                `To use MF plug-in, build.extractCSS needs to be set to false`
            );
        }
    }
    public get haveExposes() {
        return Object.keys(this.options.exposes).length > 0;
    }
    public get name() {
        return SSR.fixVarName(this.ssr.name);
    }
    public get output() {
        return path.resolve(this.ssr.outputDirInClient, entryDirName);
    }
    public get outputManifest() {
        return path.resolve(this.output, manifestJsonName);
    }
    public get manifestRoutePath() {
        return `${this.ssr.publicPath}${entryDirName}/${manifestJsonName}`;
    }
    public getWebpackPublicPathVarName(name: string) {
        return `__webpack_public_path_${SSR.fixVarName(name)}_${
            this.entryName
        }`;
    }
}

export class ReadyPromise<T> {
    /**
     * 执行完成
     */
    public finish!: (value: T) => void;
    /**
     * 等待执行完成
     */
    public await: Promise<T>;
    /**
     * 是否已经执行完成
     */
    public finished = false;
    public constructor() {
        this.await = new Promise<T>((resolve) => {
            this.finish = (value: T) => {
                this.finished = true;
                resolve(value);
            };
        });
    }
    public get loading() {
        return !this.finished;
    }
}
