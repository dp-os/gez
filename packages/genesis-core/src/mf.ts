import path from 'path';
import serialize from 'serialize-javascript';
import axios from 'axios';
import fflate from 'fflate';
import write from 'write';

import type * as Genesis from '.';
import { Plugin } from './plugin';
import type { Renderer } from './renderer';
import { SSR } from './ssr';

const mf = Symbol('mf');
const entryDirName = 'node-exposes';
const manifestJsonName = 'manifest.json';

interface ManifestJson {
    createTime: number;
    client: string;
    server: string;
}

class RemoteModule {
    public remote: Remote;
    public constructor(remote: Remote) {
        this.remote = remote;
        const { ssr } = remote;
        Object.defineProperty(ssr.sandboxGlobal, this.varName, {
            get: () => this
        });
        Object.defineProperty(
            ssr.sandboxGlobal,
            SSR.getPublicPathVarName(remote.options.name),
            {
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
        const version = manifest.server ? `.${manifest.server}` : '';

        return path.resolve(baseDir, `js/${mf.entryName}${version}.js`);
    }
    public async init() {
        await this.remote.init();
    }
    public destroy() {
        delete global[this.varName];
    }
}

class Remote {
    public ssr: Genesis.SSR;
    public options: Genesis.MFRemote;
    public manifest: ManifestJson = {
        client: '',
        server: '',
        createTime: 0
    }
    public ready = new ReadyPromise<true>();
    private remoteModule: RemoteModule;
    private renderer?: Renderer;
    private startTime = 0;
    private timer?: NodeJS.Timeout
    private already = false;
    public constructor(ssr: Genesis.SSR, options: Genesis.MFRemote) {
        this.ssr = ssr;
        this.options = options;
        this.remoteModule = new RemoteModule(this);
        this.connect = this.connect.bind(this);
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
            this.connect();
        }
        await this.ready.await;
    }
    public async connect() {
        const { mf, manifest } = this;
        this.startTime = Date.now();
        const url = `${this.serverPublicPath}${entryDirName}/${manifestJsonName}`;
        const res: ManifestJson = await axios.get(url).then((res) => res.data).catch(() => null);
        if (res) {
            // 服务端版本号一致，则不用下载
            if (manifest.server && manifest.server === res.server) return;
            if (!manifest.server && manifest.createTime === res.createTime) return;
            await this.download(res);
            this.manifest = res;
        } else {
            console.log(`Request error: ${url}`);
        }
        this.timer = setTimeout(this.connect, mf.options.intervalTime);
    }
    public async download(data: ManifestJson) {
        const zipName = (data.server || 'development') + '.zip';
        const url = `${this.serverPublicPath}${entryDirName}/${zipName}`;
        const res = await axios.get(url, { responseType: 'arraybuffer' }).then((res) => res.data).catch(() => null);
        if (res) {
            try {
                write.sync(path.resolve(`.${entryDirName}`, this.options.name, zipName), res);
                const files = fflate.unzipSync(res);
                Object.keys(files).forEach(name => {
                    write.sync(path.resolve(this.baseDir, 'js', name), files[name]);
                });
            } catch(e) {
                console.log(url, e);
                return;
            }
            if (this.ready.loading) {
                console.log(`${this.options.name} download time is ${Date.now() - this.startTime}ms`)
                this.ready.finish(true);
            } else {
                console.log(`${this.options.name} updated time is ${Date.now() - this.startTime}ms`)
            }
            this.renderer?.reload();
        } else {
            console.log(`${this.options.name} dependency download failed, The url is ${url}`)
        }
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
        const version = manifest.client ? `.${manifest.client}` : '';
        const fullPath = `${clientPublicPath}js/${mf.entryName}${version}.js`;

        appendScript(mf.getWebpackPublicPathVarName(name), fullPath);
        appendScript(SSR.getPublicPathVarName(name), clientPublicPath);

        return scriptText;
    }
}

class RemoteGroup {
    public items: Remote[];
    public ssr: SSR;
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
}

type ExposesWatchCallback = () => void;

class Exposes {
    public ssr: Genesis.SSR;
    private subs: ExposesWatchCallback[] = [];
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
    }
    public get mf() {
        return MF.get(this.ssr);
    }
    public watch(cb: ExposesWatchCallback) {
        this.subs.push(cb);
    }
    public emit() {
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
        shared: {}
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
        return `__webpack_public_path_${SSR.fixVarName(name)}_${this.entryName
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
