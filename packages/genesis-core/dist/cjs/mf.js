"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyPromise = exports.MF = exports.MFPlugin = void 0;
const eventsource_1 = __importDefault(require("eventsource"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
const write_1 = __importDefault(require("write"));
const plugin_1 = require("./plugin");
const ssr_1 = require("./ssr");
const mf = Symbol('mf');
class RemoteModule {
    constructor(remote) {
        this.remote = remote;
        const { ssr } = remote;
        Object.defineProperty(ssr.sandboxGlobal, this.varName, {
            get: () => this
        });
        Object.defineProperty(ssr.sandboxGlobal, ssr_1.SSR.getPublicPathVarName(remote.options.name), {
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
        return path_1.default.resolve(baseDir, `js/${mf.entryName}${version}.js`);
    }
    async init() {
        await this.remote.init();
    }
    destroy() {
        delete global[this.varName];
    }
}
class RemoteItem {
    constructor(ssr, options) {
        this.version = '';
        this.clientVersion = '';
        this.serverVersion = '';
        this.ready = new ReadyPromise();
        this.startTime = 0;
        this.onMessage = (evt) => {
            var _a;
            const data = JSON.parse(evt.data);
            if (data.version === this.version) {
                return;
            }
            Object.keys(data.files).forEach((file) => {
                const text = data.files[file];
                const fullPath = path_1.default.resolve(this.baseDir, file);
                write_1.default.sync(fullPath, text);
            });
            this.version = data.version;
            this.clientVersion = data.clientVersion;
            this.serverVersion = data.serverVersion;
            const name = this.options.name;
            if (this.ready.finished) {
                (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.reload();
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
        return path_1.default.resolve(this.ssr.outputDirInServer, `remotes/${this.options.name}`);
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
            this.eventsource = new eventsource_1.default(this.options.serverUrl);
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
            const val = (0, serialize_javascript_1.default)(value);
            scriptText += `window["${varName}"] = ${val};`;
        };
        const version = clientVersion ? `.${clientVersion}` : '';
        const fullPath = `${baseUri}js/${mf.entryName}${version}.js`;
        appendScript(mf.getWebpackPublicPathVarName(name), fullPath);
        appendScript(ssr_1.SSR.getPublicPathVarName(name), baseUri);
        return scriptText;
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
        if (!fs_1.default.existsSync(fullPath)) {
            return '';
        }
        return fs_1.default.readFileSync(fullPath, { encoding: 'utf-8' });
    }
}
class MFPlugin extends plugin_1.Plugin {
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
exports.MFPlugin = MFPlugin;
class MF {
    constructor(ssr, options = {}) {
        var _a, _b;
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
        this.remote = new Remote(ssr);
        ssr.plugin.use(this.mfPlugin);
        if (((_b = (_a = ssr.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.extractCSS) !== false) {
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
    get name() {
        return ssr_1.SSR.fixVarName(this.ssr.name);
    }
    get outputExposesVersion() {
        return path_1.default.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-version.txt');
    }
    get outputExposesFiles() {
        return path_1.default.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-files.json');
    }
    getWebpackPublicPathVarName(name) {
        return `__webpack_public_path_${ssr_1.SSR.fixVarName(name)}_${this.entryName}`;
    }
}
exports.MF = MF;
class ReadyPromise {
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
exports.ReadyPromise = ReadyPromise;
