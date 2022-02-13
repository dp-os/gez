"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyPromise = exports.MF = exports.MFPlugin = void 0;
const path_1 = __importDefault(require("path"));
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
const axios_1 = __importDefault(require("axios"));
const fflate_1 = __importDefault(require("fflate"));
const write_1 = __importDefault(require("write"));
const plugin_1 = require("./plugin");
const ssr_1 = require("./ssr");
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
        Object.defineProperty(ssr.sandboxGlobal, ssr_1.SSR.getPublicPathVarName(remote.options.name), {
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
        return path_1.default.resolve(baseDir, `js/${mf.entryName}${version}.js`);
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
        return path_1.default.resolve(this.ssr.outputDirInServer, `remotes/${this.options.name}/${baseName}`);
    }
    async connect() {
        var _a;
        const { mf, manifest, ssr } = this;
        this.startTime = Date.now();
        const url = `${this.serverPublicPath}${entryDirName}/${manifestJsonName}`;
        const res = await axios_1.default.get(url).then((res) => res.data).catch(() => null);
        if (res && typeof res === 'object') {
            // 服务端版本号一致，则不用下载
            if (manifest.server && manifest.server === res.server)
                return;
            if (!manifest.server && manifest.createTime === res.createTime)
                return;
            const baseName = res.server || 'development';
            const baseDir = this.getWrite(res.server);
            if (!ssr.isProd && res.client) {
                const writeDir = path_1.default.resolve('node_modules', this.options.name);
                const packageJson = {
                    "name": this.options.name,
                    "version": "1.0.0",
                    "main": "index.js"
                };
                const ok = await this.download(`${baseName}-dts.zip`, writeDir, (name) => {
                    const filename = name.replace(/\.d\.ts$/, '').replace(/\.vue$/, '');
                    write_1.default.sync(path_1.default.resolve(writeDir, `${filename}.js`), `// Federation write module type`);
                });
                if (ok) {
                    write_1.default.sync(path_1.default.resolve(writeDir, 'package.json'), JSON.stringify(packageJson, null, 4));
                }
            }
            const ok = await this.download(`${baseName}.zip`, path_1.default.resolve(baseDir, 'js'));
            if (ok) {
                if (this.ready.loading) {
                    console.log(`${this.options.name} download time is ${Date.now() - this.startTime}ms`);
                    this.ready.finish(true);
                }
                else {
                    console.log(`${this.options.name} updated time is ${Date.now() - this.startTime}ms`);
                }
                this.manifest = res;
                (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.reload();
            }
        }
        else {
            console.log(`Request error: ${url}`);
        }
        this.timer = setTimeout(this.connect, mf.options.intervalTime);
    }
    async download(zipName, writeDir, cb) {
        const url = `${this.serverPublicPath}${entryDirName}/${zipName}`;
        const res = await axios_1.default.get(url, { responseType: 'arraybuffer' }).then((res) => res.data).catch(() => null);
        if (res) {
            try {
                write_1.default.sync(path_1.default.resolve(`.${entryDirName}`, this.options.name, zipName), res);
                const files = fflate_1.default.unzipSync(res);
                Object.keys(files).forEach(name => {
                    write_1.default.sync(path_1.default.resolve(writeDir, name), files[name]);
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
            const val = (0, serialize_javascript_1.default)(value);
            scriptText += `window["${varName}"] = ${val};`;
        };
        const version = manifest.client ? `.${manifest.client}` : '';
        const fullPath = `${clientPublicPath}js/${mf.entryName}${version}.js`;
        appendScript(mf.getWebpackPublicPathVarName(name), fullPath);
        appendScript(ssr_1.SSR.getPublicPathVarName(name), clientPublicPath);
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
    get haveExposes() {
        return Object.keys(this.options.exposes).length > 0;
    }
    get name() {
        return ssr_1.SSR.fixVarName(this.ssr.name);
    }
    get output() {
        return path_1.default.resolve(this.ssr.outputDirInClient, entryDirName);
    }
    get outputManifest() {
        return path_1.default.resolve(this.output, manifestJsonName);
    }
    get manifestRoutePath() {
        return `${this.ssr.publicPath}${entryDirName}/${manifestJsonName}`;
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
