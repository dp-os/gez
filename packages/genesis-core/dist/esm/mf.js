import path from 'path';
import serialize from 'serialize-javascript';
import axios from 'axios';
import fflate from 'fflate';
import write from 'write';
import { Plugin } from './plugin';
import { SSR } from './ssr';
const mf = Symbol('mf');
const entryDirName = 'node-exposes';
const manifestJsonName = 'manifest.json';
class RemoteModule {
    constructor(remote) {
        this.remote = remote;
        const { ssr } = remote;
        Object.defineProperty(ssr.sandboxGlobal, this.varName, {
            get: () => this
        });
        Object.defineProperty(ssr.sandboxGlobal, SSR.getPublicPathVarName(remote.options.name), {
            get: () => this.remote.clientPublicPath
        });
    }
    get varName() {
        const { mf, options } = this.remote;
        const name = options.name;
        const varName = mf.getWebpackPublicPathVarName(name);
        return varName;
    }
    get filename() {
        const { manifest, mf, baseDir } = this.remote;
        const version = manifest.server ? `.${manifest.server}` : '';
        return path.resolve(baseDir, `js/${mf.entryName}${version}.js`);
    }
    async init() {
        await this.remote.init();
    }
    destroy() {
        delete global[this.varName];
    }
}
class Remote {
    constructor(ssr, options) {
        this.manifest = {
            client: '',
            server: '',
            createTime: 0,
            dts: false
        };
        this.ready = new ReadyPromise();
        this.startTime = 0;
        this.already = false;
        this.ssr = ssr;
        this.options = options;
        this.remoteModule = new RemoteModule(this);
        this.connect = this.connect.bind(this);
    }
    get mf() {
        return MF.get(this.ssr);
    }
    get clientPublicPath() {
        return `${this.options.clientOrigin}/${this.options.name}/`;
    }
    get serverPublicPath() {
        return `${this.options.serverOrigin}/${this.options.name}/`;
    }
    get baseDir() {
        return this.getWrite(this.manifest.server);
    }
    async init(renderer) {
        if (renderer) {
            this.renderer = renderer;
        }
        if (!this.already) {
            this.already = true;
            this.connect();
        }
        await this.ready.await;
    }
    getWrite(server) {
        const baseName = server || 'development';
        return path.resolve(this.ssr.outputDirInServer, `remotes/${this.options.name}/${baseName}`);
    }
    async connect() {
        const { mf, manifest, ssr } = this;
        this.startTime = Date.now();
        const url = `${this.serverPublicPath}${entryDirName}/${manifestJsonName}`;
        const res = await axios.get(url).then((res) => res.data).catch(() => null);
        if (res && typeof res === 'object') {
            // 服务端版本号一致，则不用下载
            if (manifest.server && manifest.server === res.server)
                return;
            if (!manifest.server && manifest.createTime === res.createTime)
                return;
            const baseName = res.server || 'development';
            const baseDir = this.getWrite(res.server);
            if (!ssr.isProd && res.client) {
                const writeDir = path.resolve('node_modules', this.options.name);
                const packageJson = {
                    "name": this.options.name,
                    "version": "1.0.0",
                    "main": "index.js"
                };
                const ok = await this.download(`${baseName}-dts.zip`, writeDir, (name) => {
                    const filename = name.replace(/\.d\.ts$/, '').replace(/\.vue$/, '');
                    write.sync(path.resolve(writeDir, `${filename}.js`), `// Federation write module type`);
                });
                if (ok) {
                    write.sync(path.resolve(writeDir, 'package.json'), JSON.stringify(packageJson, null, 4));
                }
            }
            const ok = await this.download(`${baseName}.zip`, path.resolve(baseDir, 'js'));
            if (ok) {
                if (this.ready.loading) {
                    console.log(`${this.options.name} download time is ${Date.now() - this.startTime}ms`);
                    this.ready.finish(true);
                }
                else {
                    console.log(`${this.options.name} updated time is ${Date.now() - this.startTime}ms`);
                }
                this.manifest = res;
                this.renderer?.reload();
            }
        }
        else {
            console.log(`Request error: ${url}`);
        }
        this.timer = setTimeout(this.connect, mf.options.intervalTime);
    }
    async download(zipName, writeDir, cb) {
        const url = `${this.serverPublicPath}${entryDirName}/${zipName}`;
        const res = await axios.get(url, { responseType: 'arraybuffer' }).then((res) => res.data).catch(() => null);
        if (res) {
            try {
                write.sync(path.resolve(`.${entryDirName}`, this.options.name, zipName), res);
                const files = fflate.unzipSync(res);
                Object.keys(files).forEach(name => {
                    write.sync(path.resolve(writeDir, name), files[name]);
                    cb && cb(name);
                });
            }
            catch (e) {
                console.log(url, e);
                return false;
            }
            return true;
        }
        else {
            console.log(`${this.options.name} dependency download failed, The url is ${url}`);
        }
        return false;
    }
    destroy() {
        this.timer && clearTimeout(this.timer);
        this.remoteModule.destroy();
    }
    inject() {
        const { name } = this.options;
        const { manifest, mf, clientPublicPath } = this;
        let scriptText = '';
        const appendScript = (varName, value) => {
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
    constructor(ssr) {
        this.ssr = ssr;
        this.items = this.mf.options.remotes.map((opts) => new Remote(ssr, opts));
    }
    get mf() {
        return MF.get(this.ssr);
    }
    inject() {
        const { items } = this;
        if (!items.length) {
            return '';
        }
        const arr = items.map((item) => {
            return item.inject();
        });
        return `<script>${arr.join('')}</script>`;
    }
    init(...args) {
        return Promise.all(this.items.map((item) => item.init(...args)));
    }
}
class Exposes {
    constructor(ssr) {
        this.subs = [];
        this.ssr = ssr;
    }
    get mf() {
        return MF.get(this.ssr);
    }
    watch(cb) {
        this.subs.push(cb);
    }
    emit() {
        this.subs.forEach((cb) => cb());
    }
}
export class MFPlugin extends Plugin {
    constructor(ssr) {
        super(ssr);
    }
    get mf() {
        return MF.get(this.ssr);
    }
    renderBefore(context) {
        context.data.script += this.mf.remote.inject();
    }
}
export class MF {
    constructor(ssr, options = {}) {
        this.options = {
            remotes: [],
            intervalTime: 1000,
            exposes: {},
            shared: {}
        };
        this.entryName = 'exposes';
        this.ssr = ssr;
        Object.assign(this.options, options);
        ssr[mf] = this;
        this.mfPlugin = new MFPlugin(ssr);
        this.exposes = new Exposes(ssr);
        this.remote = new RemoteGroup(ssr);
        ssr.plugin.use(this.mfPlugin);
        if (ssr.options?.build?.extractCSS !== false) {
            throw new TypeError(`To use MF plug-in, build.extractCSS needs to be set to false`);
        }
    }
    static is(ssr) {
        return ssr[mf] instanceof MF;
    }
    static get(ssr) {
        if (!this.is(ssr)) {
            throw new TypeError(`SSR instance: MF instance not found`);
        }
        return ssr[mf];
    }
    get haveExposes() {
        return Object.keys(this.options.exposes).length > 0;
    }
    get name() {
        return SSR.fixVarName(this.ssr.name);
    }
    get output() {
        return path.resolve(this.ssr.outputDirInClient, entryDirName);
    }
    get outputManifest() {
        return path.resolve(this.output, manifestJsonName);
    }
    get manifestRoutePath() {
        return `${this.ssr.publicPath}${entryDirName}/${manifestJsonName}`;
    }
    getWebpackPublicPathVarName(name) {
        return `__webpack_public_path_${SSR.fixVarName(name)}_${this.entryName}`;
    }
}
export class ReadyPromise {
    constructor() {
        /**
         * 是否已经执行完成
         */
        this.finished = false;
        this.await = new Promise((resolve) => {
            this.finish = (value) => {
                this.finished = true;
                resolve(value);
            };
        });
    }
    get loading() {
        return !this.finished;
    }
}
