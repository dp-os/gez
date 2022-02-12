import Eventsource from 'eventsource';
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';
import write from 'write';
import { Plugin } from './plugin';
import { SSR } from './ssr';
const mf = Symbol('mf');
class RemoteModule {
    constructor(remote) {
        this.remote = remote;
        const { ssr } = remote;
        Object.defineProperty(ssr.sandboxGlobal, this.varName, {
            get: () => this
        });
        Object.defineProperty(ssr.sandboxGlobal, SSR.getPublicPathVarName(remote.options.name), {
            get: () => this.remote.baseUri
        });
    }
    get varName() {
        const { mf, options } = this.remote;
        const name = options.name;
        const varName = mf.getWebpackPublicPathVarName(name);
        return varName;
    }
    get filename() {
        const { serverVersion, mf, baseDir } = this.remote;
        const version = serverVersion ? `.${serverVersion}` : '';
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
        this.version = '';
        this.clientVersion = '';
        this.serverVersion = '';
        this.ready = new ReadyPromise();
        this.startTime = 0;
        this.onMessage = (evt) => {
            const data = JSON.parse(evt.data);
            if (data.version === this.version) {
                return;
            }
            Object.keys(data.files).forEach((file) => {
                const text = data.files[file];
                const fullPath = path.resolve(this.baseDir, file);
                write.sync(fullPath, text);
            });
            this.version = data.version;
            this.clientVersion = data.clientVersion;
            this.serverVersion = data.serverVersion;
            const name = this.options.name;
            if (this.ready.finished) {
                this.renderer?.reload();
                console.log(`${name} remote dependent reload completed`);
            }
            else {
                console.log(`${name} remote dependent download completed ${Date.now() - this.startTime}ms`);
                this.ready.finish(true);
            }
        };
        this.ssr = ssr;
        this.options = options;
        this.remoteModule = new RemoteModule(this);
    }
    get mf() {
        return MF.get(this.ssr);
    }
    get baseDir() {
        return path.resolve(this.ssr.outputDirInServer, `remotes/${this.options.name}`);
    }
    get baseUri() {
        const base = this.options.publicPath || '';
        return `${base}/${this.options.name}/`;
    }
    async init(renderer) {
        if (renderer) {
            this.renderer = renderer;
        }
        if (!this.eventsource) {
            this.startTime = Date.now();
            this.eventsource = new Eventsource(this.options.serverUrl, {
                headers: {}
            });
            this.eventsource.addEventListener('message', this.onMessage);
        }
        await this.ready.await;
    }
    destroy() {
        const { eventsource } = this;
        if (eventsource) {
            eventsource.removeEventListener('message', this.onMessage);
            eventsource.close();
        }
        this.remoteModule.destroy();
    }
    inject() {
        const { name } = this.options;
        const { clientVersion, mf, baseUri } = this;
        let scriptText = '';
        const appendScript = (varName, value) => {
            const val = serialize(value);
            scriptText += `window["${varName}"] = ${val};`;
        };
        const version = clientVersion ? `.${clientVersion}` : '';
        const fullPath = `${baseUri}js/${mf.entryName}${version}.js`;
        appendScript(mf.getWebpackPublicPathVarName(name), fullPath);
        appendScript(SSR.getPublicPathVarName(name), baseUri);
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
    watch(cb, version = '') {
        this.subs.push(cb);
        const newVersion = this.readText(this.mf.outputExposesVersion);
        if (version !== newVersion) {
            const text = this.readText(this.mf.outputExposesFiles);
            text && cb(JSON.parse(text));
        }
        return () => {
            const index = this.subs.indexOf(cb);
            if (index > -1) {
                this.subs.splice(index, 1);
            }
        };
    }
    emit() {
        const text = this.readText(this.mf.outputExposesFiles);
        if (!text)
            return;
        const data = JSON.parse(text);
        this.subs.forEach((cb) => cb(data));
    }
    readText(fullPath) {
        if (!fs.existsSync(fullPath)) {
            return '';
        }
        return fs.readFileSync(fullPath, { encoding: 'utf-8' });
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
        return path.resolve(this.ssr.outputDirInClient, 'node-exposes');
    }
    get outputManifest() {
        return path.resolve(this.output, 'manifest.json');
    }
    get outputExposesVersion() {
        return path.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-version.txt');
    }
    get outputExposesFiles() {
        return path.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-files.json');
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
