import del from 'del';
import fflate from 'fflate';
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';
import write from 'write';

import type * as Genesis from '..';
import type { Renderer } from '../renderer';
import { SSR } from '../ssr';
import { md5 } from '../util';
import { type MF } from '.';
import { Base } from './base';
import { ENTRY_DIR_NAME, MANIFEST_JSON_NAME } from './config';
import { createManifest, Json } from './json';
import { Logger } from './logger';
import { FileFetch, HttpFetch, NullFetch } from './remote-fetch';

const developmentZipName = 'development';

type ManifestJson = Genesis.MFManifestJson;
type ClientManifest = Genesis.ClientManifest;

interface RemoteFetchOptions {
    getJson: (context: {
        filename: string;
        t: number;
        remote: Remote;
    }) => Promise<ClientManifest | null>;
    getZip: (context: {
        filename: string;
        t: number;
        remote: Remote;
    }) => Promise<ArrayBuffer | null>;
}

/**
 * VM 运行时注入的全局变量
 */
abstract class VMRuntimeInject extends Base {
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
        super(remote.ssr, remote.mf);
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
    public constructor(ssr: SSR, mf: MF) {
        super(ssr, mf);

        this.manifestJson = new Json<ManifestJson>(
            mf.outputManifest,
            createManifest
        );
        if (!ssr.isProd) {
            this.manifestJson.set(createManifest());
        }
    }
    public get varName(): string {
        return this.mf.getWebpackPublicPathVarName(this.ssr.name);
    }
    public get filename() {
        const { ssr, manifestJson, mf } = this;
        const output = ssr.outputDirInServer;
        const version = manifestJson.data.s ? `.${manifestJson.data.s}` : '';

        return path.resolve(output, `js/${mf.entryName}${version}.js`);
    }
    public async fetch() {}
    public injectHTML(): string {
        const { ssr, manifestJson, mf } = this;
        const version = manifestJson.data.c ? `.${manifestJson.data.c}` : '';
        const value = `${ssr.cdnPublicPath}${ssr.publicPath}js/${mf.entryName}${version}.js`;
        return `window["${this.varName}"] = ${serialize(value)};`;
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
        if (info.exists && info.data.version === this.version) {
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
            zipU8 = await remote.request.getZip({
                filename: this.url,
                remote
            });
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

export class Remote extends Base {
    public options: Genesis.MFRemote;
    public ready = new ReadyPromise<true>();
    private remoteModule: VMRuntimeInjectRemote;
    private renderer?: Renderer;
    private timer?: NodeJS.Timeout;
    private already = false;
    private manifestJson: Json<ManifestJson>;
    private clientManifestJson: Json<ClientManifest>;
    private pollingStatus: PollingStatus = PollingStatus.noStart;
    private httpFetch = new HttpFetch();
    private fileFetch = new FileFetch();
    private nullFetch = new NullFetch();
    public constructor(ssr: Genesis.SSR, mf: MF, options: Genesis.MFRemote) {
        super(ssr, mf);
        this.options = options;
        this.remoteModule = new VMRuntimeInjectRemote(this);
        this.polling = this.polling.bind(this);
        this.manifestJson = new Json<ManifestJson>(
            path.resolve(this.writeDir, 'manifest.json'),
            createManifest
        );
        this.clientManifestJson = new Json<ClientManifest>(
            path.resolve(this.writeDir, 'vue-ssr-client-manifest.json'),
            () => {
                return {
                    publicPath: '',
                    all: [],
                    async: [],
                    initial: [],
                    modules: {}
                };
            }
        );
        if (ssr.isProd && this.manifest.s) {
            this.download(this.manifest);
        }
    }
    public get request() {
        const { serverOrigin } = this.options;
        if (path.isAbsolute(serverOrigin)) {
            return this.fileFetch;
        } else if (serverOrigin.indexOf('http') === 0) {
            return this.httpFetch;
        }
        return this.nullFetch;
    }
    public get requestConfig() {
        return this.options.serverRequestConfig || {};
    }
    public get manifest() {
        return this.manifestJson.data;
    }
    public get clientPublicPath() {
        return `${this.options.clientOrigin}/${this.options.name}/`;
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
    public getClientManifest() {
        const data = this.clientManifestJson.data;
        data.publicPath = this.clientPublicPath;
        return data;
    }
    public async fetch(postinstall = false): Promise<boolean> {
        const { manifest } = this;
        const t = postinstall ? 0 : manifest.t;
        const filename = this.getFullFile(MANIFEST_JSON_NAME);
        if (!filename) {
            Logger.noConfig(filename);
            return false;
        }
        const res: ManifestJson = await this.request.getJson({
            filename,
            t,
            remote: this
        });
        if (res && typeof res === 'object') {
            return this.download(res);
        } else {
            Logger.requestFailed(filename);
        }
        return false;
    }
    public getFullFile(filename: string) {
        let { serverOrigin, name } = this.options;
        if (
            serverOrigin.includes('[name]') ||
            serverOrigin.includes('[filename]')
        ) {
            serverOrigin = serverOrigin
                .replace(/\[name\]/g, name)
                .replace(/\[filename\]/g, filename);
        } else if (serverOrigin) {
            serverOrigin = `${serverOrigin}/${name}/${ENTRY_DIR_NAME}/${filename}`;
        }

        return serverOrigin;
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
        const url = this.getFullFile(
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
            url = this.getFullFile(`${manifest.s}.zip`);
            version = manifest.s;
            clean = false;
        } else {
            url = this.getFullFile(`${developmentZipName}.zip`);
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
        this.clientManifestJson.get();
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
        const start = async () => {
            await this.fetch();
            this.timer = setTimeout(start, mf.options.intervalTime);
        };

        return start();
    }
    /**
     * 停止轮询
     */
    public async stopPolling() {
        this.timer && clearTimeout(this.timer);
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

export class RemoteGroup extends Base {
    private items: Remote[];
    private injectSelf?: VMRuntimeInjectSelf;
    public constructor(ssr: Genesis.SSR, mf: MF) {
        super(ssr, mf);
        this.items = this.mf.options.remotes.map(
            (opts) => new Remote(ssr, mf, opts)
        );
        if (mf.haveExposes) {
            // 自己调用自己的模块联邦
            // eslint-disable-next-line no-new
            const injectSelf = new VMRuntimeInjectSelf(ssr, mf);
            injectSelf.inject();
            this.injectSelf = injectSelf;
        }
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
    public getClientManifest(name?: string) {
        let arr = this.items;
        if (name) {
            arr = arr.filter((item) => {
                return item.options.name === name;
            });
        }
        return arr.map((item) => item.getClientManifest());
    }
    public postinstall() {
        const arr = this.items;
        return Promise.all(arr.map((item) => item.fetch(true)));
    }
    public polling() {
        return Promise.all(this.items.map((item) => item.polling()));
    }
    public stopPolling() {
        return Promise.all(this.items.map((item) => item.stopPolling()));
    }
}

class ReadyPromise<T> {
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
