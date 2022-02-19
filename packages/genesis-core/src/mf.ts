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

declare module 'axios' {
    export interface AxiosRequestConfig {
        _startTime?: number;
        loggerText?: string;
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
                console.log(`mf: ${url} ${time}ms`);
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
    public async init() {
        await this.remote.init();
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
    public get(): T {
        const { filename } = this;
        if (fs.existsSync(filename)) {
            const text = fs.readFileSync(filename, { encoding: 'utf-8' });
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

class Remote {
    public ssr: Genesis.SSR;
    public options: Genesis.MFRemote;
    public ready = new ReadyPromise<true>();
    private remoteModule: RemoteModule;
    private renderer?: Renderer;
    private timer?: NodeJS.Timeout;
    private already = false;
    private request = createRequest();
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
        if (this.manifest.t) {
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
        const baseName = server || 'development';
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
            // 服务端版本号一致，则不用下载
            if (manifest.s && manifest.s === res.s) return true;
            if (!manifest.s && manifest.t === res.t) return true;
            return this.downloadZip(res);
        }
        console.log(`Request error: ${url}`, res);
        return false;
    }
    private async downloadZip(manifest: ManifestJson): Promise<boolean> {
        const baseName = manifest.s || 'development';
        const baseDir = this.getWrite(manifest.s);
        const arr: Promise<boolean>[] = [
            this.download(
                `${baseName}.zip`,
                path.resolve(baseDir, 'js'),
                !!manifest.s
            ),
            this.downloadDts(manifest)
        ];

        const [ok] = await Promise.all(arr);
        if (ok) {
            if (this.ready.loading) {
                this.ready.finish(true);
            } else {
                this.renderer?.reload();
            }
            this.manifestJson.set(manifest);
            return true;
        }
        return false;
    }
    private async downloadDts(manifest: ManifestJson) {
        const { ssr } = this;
        if (ssr.isProd || manifest.d !== 1) {
            return false;
        }
        const baseName = manifest.s || 'development';
        const writeDir = path.resolve('node_modules', this.options.name);
        del.sync(writeDir);
        const ok = await this.download(
            `${baseName}-dts.zip`,
            writeDir,
            !!manifest.s,
            (name) => {
                const filename = name.replace(/\.d\.ts$/, '');
                write.sync(
                    path.resolve(writeDir, `${filename}.js`),
                    `// Federation write module type`
                );
            }
        );
        return ok;
    }
    private async polling() {
        const { mf } = this;
        await this.fetch();
        this.timer = setTimeout(this.polling, mf.options.intervalTime);
    }
    private async download(
        zipName: string,
        writeDir: string,
        readCache = true,
        cb?: (name: string) => void
    ) {
        const url = `${this.serverPublicPath}${entryDirName}/${zipName}`;
        const cacheDir = path.resolve(`.${entryDirName}`);
        const cacheFilename = path.resolve(
            cacheDir,
            this.options.name,
            zipName
        );
        let zipU8: Uint8Array | null;
        // 判断本地缓存是否存在
        if (readCache && fs.existsSync(cacheFilename)) {
            zipU8 = new Uint8Array(fs.readFileSync(cacheFilename));
            console.log(
                `Read cache: ${path.relative(cacheDir, cacheFilename)}`
            );
        } else {
            zipU8 = await this.request
                .get(url, { responseType: 'arraybuffer' })
                .then((res) => res.data)
                .catch(() => null);
            // 写入缓存
            write.sync(cacheFilename, zipU8);
        }
        if (zipU8) {
            try {
                const files = fflate.unzipSync(zipU8);
                Object.keys(files).forEach((name) => {
                    write.sync(path.resolve(writeDir, name), files[name]);
                    cb && cb(name);
                });
            } catch (e) {
                console.log(url, e);
                return false;
            }
            return true;
        } else {
            console.log(
                `${this.options.name} dependency download failed, The url is ${url}`
            );
        }
        return false;
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
