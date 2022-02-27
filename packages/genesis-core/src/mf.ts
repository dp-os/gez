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
import { md5 } from './util';

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
        return console.log(`genesis ${text}`);
    }
}

const reZip = /\.zip$/;
function createRequest() {
    let first = true;
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
            if (reZip.test(url) || first) {
                Logger.log(`${url} ${time}ms`);
                first = false;
            }
            return Promise.resolve(axiosConfig);
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    return request;
}

type ManifestJson = Genesis.MFManifestJson;

/**
 * VM 运行时注入的全局变量
 */
abstract class VMRuntimeInject {
    public ssr: SSR;
    public constructor(ssr: SSR) {
        this.ssr = ssr;
    }
    /**
     * global 当前对象注入的变量名称
     */
    public abstract get varName(): string;
    /**
     * 远程模块的入口文件
     */
    public abstract get filename(): string;
    /**
     * 执行注入
     */
    public inject() {
        const { ssr } = this;
        Object.defineProperty(ssr.sandboxGlobal, this.varName, {
            enumerable: true,
            get: () => this
        });
    }
    /**
     * 获取远程模块
     */
    public abstract fetch(): Promise<void>;
}

class VMRuntimeInjectRemote extends VMRuntimeInject {
    public remote: Remote;
    public constructor(remote: Remote) {
        super(remote.ssr);
        this.remote = remote;
        this.inject();
        Object.defineProperty(
            remote.ssr.sandboxGlobal,
            this.publicPathVarName,
            {
                enumerable: true,
                get: () => this.clientPublicPath
            }
        );
    }
    public get publicPathVarName(): string {
        return SSR.getPublicPathVarName(this.remote.options.name);
    }
    public get clientPublicPath(): string {
        return this.remote.clientPublicPath;
    }
    public get varName() {
        const { mf, options } = this.remote;
        const name = options.name;
        const varName = mf.getWebpackPublicPathVarName(name);
        return varName;
    }
    public get filename() {
        const { manifest, mf, writeDir } = this.remote;
        const version = manifest.s ? `.${manifest.s}` : '';

        return path.resolve(writeDir, `js/${mf.entryName}${version}.js`);
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

class VMRuntimeInjectSelf extends VMRuntimeInject {
    public manifestJson: Json<ManifestJson>;
    public constructor(ssr: SSR) {
        super(ssr);

        this.manifestJson = new Json<ManifestJson>(
            MF.get(ssr).outputManifest,
            createManifest
        );
        if (!ssr.isProd) {
            this.manifestJson.set(createManifest());
        }
    }
    public get varName(): string {
        return MF.get(this.ssr).getWebpackPublicPathVarName(this.ssr.name);
    }
    public get filename() {
        const { ssr, manifestJson } = this;
        const mf = MF.get(ssr);
        const output = ssr.outputDirInServer;
        const version = manifestJson.data.s ? `.${manifestJson.data.s}` : '';

        return path.resolve(output, `js/${mf.entryName}${version}.js`);
    }
    public async fetch() {}
    public injectHTML(): string {
        const { ssr, manifestJson } = this;
        const mf = MF.get(ssr);
        const version = manifestJson.data.c ? `.${manifestJson.data.c}` : '';
        const value = `${ssr.cdnPublicPath}${ssr.publicPath}js/${mf.entryName}${version}.js`;
        return `window["${this.varName}"] = ${serialize(value)};`;
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
        const { isProd } = this.remote.ssr;
        let zipU8: Uint8Array | null = null;
        const isCache = !isProd && !this.clean;
        const cacheFilename = path.resolve(
            __dirname,
            'remotes',
            `${md5(this.url)}.zip`
        );
        let isRemote = true;
        if (isCache && fs.existsSync(cacheFilename)) {
            zipU8 = new Uint8Array(fs.readFileSync(cacheFilename));
            isRemote = false;
        }
        const { writeDir, remote } = this;
        if (!zipU8) {
            zipU8 = await remote.request
                .get(this.url, { responseType: 'arraybuffer' })
                .then((res) => res.data)
                .catch(() => null);
            if (zipU8 && isCache) {
                write.sync(cacheFilename, zipU8);
            }
        }
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
            code: isRemote ? 'remote' : 'local'
        };
    }
}

enum PollingStatus {
    noStart,
    polling,
    stop
}

class Remote {
    public ssr: Genesis.SSR;
    public options: Genesis.MFRemote;
    public ready = new ReadyPromise<true>();
    private remoteModule: VMRuntimeInjectRemote;
    private renderer?: Renderer;
    private timer?: NodeJS.Timeout;
    private already = false;
    public request = createRequest();
    private manifestJson: Json<ManifestJson>;
    private pollingStatus: PollingStatus = PollingStatus.noStart;
    public constructor(ssr: Genesis.SSR, options: Genesis.MFRemote) {
        this.ssr = ssr;
        this.options = options;
        this.remoteModule = new VMRuntimeInjectRemote(this);
        this.polling = this.polling.bind(this);
        this.manifestJson = new Json<ManifestJson>(
            path.resolve(this.writeDir, 'manifest.json'),
            createManifest
        );
        if (ssr.isProd && this.manifest.s) {
            this.download(this.manifest);
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
    public get writeDir() {
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
            const { ssr, manifest } = this;

            if (!ssr.isProd && manifest.s) {
                this.download(this.manifest);
            }
        }
        await this.ready.await;
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
            return this.download(res);
        } else {
            Logger.requestFailed(url);
        }
        return false;
    }
    private getTargetUrl(target: string) {
        const { serverPublicPath } = this;
        return `${serverPublicPath}${entryDirName}/${target}`;
    }
    public async download(manifest: ManifestJson): Promise<boolean> {
        const arr: Promise<boolean>[] = [this.downloadZip(manifest)];
        if (!this.ssr.isProd) {
            arr.push(this.downloadDts(manifest));
        }
        const [ok] = await Promise.all(arr);

        return ok;
    }
    private async downloadDts(manifest: ManifestJson): Promise<boolean> {
        if (!manifest.d) {
            return true;
        }
        const writeDir: string = path.resolve(
            'node_modules',
            this.options.name
        );
        const url = this.getTargetUrl(
            `${manifest.s || developmentZipName}-dts.zip`
        );
        const version = String(manifest.t);
        const clean = !manifest.s;
        const zip = new RemoteZip({
            remote: this,
            url,
            writeDir,
            version,
            clean
        });
        const res = await zip.download();
        return res.ok;
    }
    private async downloadZip(manifest: ManifestJson): Promise<boolean> {
        let url: string;
        const writeDir: string = this.writeDir;
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
    /**
     * 开始轮询
     */
    public async polling() {
        if (this.pollingStatus === PollingStatus.polling) {
            return;
        }
        this.pollingStatus = PollingStatus.polling;
        const { mf } = this;
        await this.fetch();
        this.timer = setTimeout(this.polling, mf.options.intervalTime);
    }
    /**
     * 停止轮询
     */
    public async stopPolling() {
        clearTimeout(this.timer);
        this.pollingStatus = PollingStatus.stop;
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

        // 注入静态资源公共变量名称
        appendScript(SSR.getPublicPathVarName(name), clientPublicPath);
        // 注入远程模块公共路径的变量名称
        appendScript(mf.getWebpackPublicPathVarName(name), fullPath);

        return scriptText;
    }
}

class RemoteGroup {
    private items: Remote[];
    private ssr: SSR;
    private injectSelf?: VMRuntimeInjectSelf;
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
        this.items = this.mf.options.remotes.map(
            (opts) => new Remote(ssr, opts)
        );
        if (MF.get(ssr).haveExposes) {
            // 自己调用自己的模块联邦
            // eslint-disable-next-line no-new
            const injectSelf = new VMRuntimeInjectSelf(ssr);
            injectSelf.inject();
            this.injectSelf = injectSelf;
        }
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
        if (this.injectSelf) {
            arr.push(this.injectSelf.injectHTML());
        }
        return `<script>${arr.join('')}</script>`;
    }
    public init(...args: Parameters<Remote['init']>) {
        return Promise.all(this.items.map((item) => item.init(...args)));
    }
    public fetch(name?: string) {
        let arr = this.items;
        if (name) {
            arr = arr.filter((item) => {
                return item.options.name === name;
            });
        }
        return Promise.all(arr.map((item) => item.fetch()));
    }
    public polling() {
        return Promise.all(this.items.map((item) => item.polling()));
    }
    public stopPolling() {
        return Promise.all(this.items.map((item) => item.stopPolling()));
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
    public get varName() {
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
