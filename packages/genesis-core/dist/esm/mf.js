import Eventsource from 'eventsource';
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';
import write from 'write';
import { Plugin } from './plugin';
import { SSR } from './ssr';
const mf = Symbol('mf');
const separator = '-';
class RemoteItem {
    constructor(ssr, options) {
        this.version = '';
        this.clientVersion = '';
        this.serverVersion = '';
        this.ready = new ReadyPromise();
        this.onMessage = (evt) => {
            const data = JSON.parse(evt.data);
            const { name } = this.options;
            const { mf } = this;
            if (data.version === this.version) {
                return;
            }
            this.version = data.version;
            this.clientVersion = data.clientVersion;
            this.serverVersion = data.serverVersion;
            Object.keys(data.files).forEach((file) => {
                const text = data.files[file];
                const fullPath = path.resolve(this.ssr.outputDirInServer, `remotes/${name}/${file}`);
                write.sync(fullPath, text);
            });
            const { serverVersion } = this;
            const varName = mf.getWebpackPublicPathVarName(name);
            const version = serverVersion ? `.${serverVersion}` : '';
            global[varName] = path.resolve(this.ssr.outputDirInServer, `remotes/${name}/js/${mf.entryName}${version}.js`);
            // 当前服务已经初始化完成
            if (!this.ready.finished) {
                this.ready.finish(true);
            }
            if (this.renderer) {
                this.renderer.reload();
            }
        };
        this.ssr = ssr;
        this.options = options;
    }
    get mf() {
        return MF.get(this.ssr);
    }
    parse(value) {
        const [version = '', clientVersion = '', serverVersion = ''] = value.split(separator);
        this.version = version;
        this.clientVersion = clientVersion;
        this.serverVersion = serverVersion;
    }
    async init(renderer) {
        if (!this.eventsource) {
            this.renderer = renderer;
            this.eventsource = new Eventsource(this.options.serverUrl);
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
    }
    inject() {
        const { name, publicPath } = this.options;
        const { clientVersion, mf } = this;
        const version = clientVersion ? `.${clientVersion}` : '';
        const fullPath = publicPath + `/${name}/js/${mf.entryName}${version}.js`;
        const value = serialize(fullPath);
        const varName = mf.getWebpackPublicPathVarName(name);
        return `window["${varName}"] = ${value};`;
    }
}
class Remote {
    constructor(ssr) {
        this.ssr = ssr;
        this.items = this.mf.options.remotes.map((opts) => new RemoteItem(ssr, opts));
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
        this.options = { remotes: [], exposes: {}, shared: {} };
        this.entryName = 'exposes';
        this.ssr = ssr;
        Object.assign(this.options, options);
        ssr[mf] = this;
        this.mfPlugin = new MFPlugin(ssr);
        this.exposes = new Exposes(ssr);
        this.remote = new Remote(ssr);
        ssr.plugin.use(this.mfPlugin);
        if (ssr.options?.build?.extractCSS !== false) {
            throw new TypeError(`To use MF plug-in, build.extractCSS needs to be set to false`);
        }
    }
    static is(ssr) {
        return ssr[mf] instanceof MF;
    }
    static get(ssr) {
        return ssr[mf];
    }
    get name() {
        return SSR.fixVarName(this.ssr.name);
    }
    get outputExposesVersion() {
        return path.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-version.txt');
    }
    get outputExposesFiles() {
        return path.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-files.json');
    }
    getWebpackPublicPathVarName(name) {
        return `__webpack_public_path_${this.name}_${SSR.fixVarName(name)}`;
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
