"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MF = exports.MFPlugin = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
const write_1 = __importDefault(require("write"));
const plugin_1 = require("./plugin");
const ssr_1 = require("./ssr");
const mf = Symbol('mf');
const separator = '-';
class Remote {
    constructor(ssr, options) {
        this.version = '';
        this.clientVersion = '';
        this.serverVersion = '';
        this.ssr = ssr;
        this.options = options;
    }
    get mf() {
        return MF.get(this.ssr);
    }
    parse(version) {
        const arr = version.split(separator);
        if (arr.length === 3) {
            this.version = version;
            if (arr[2] === 'true') {
                this.clientVersion = arr[0];
                this.serverVersion = arr[1];
                return;
            }
        }
        this.clientVersion = '';
        this.serverVersion = '';
    }
    async get() {
        const { name } = this.options;
        const { mf } = this;
        let serverUrl = this.options.serverUrl;
        serverUrl += serverUrl.includes('?') ? '&' : '?';
        serverUrl += `version=${this.version}`;
        const res = await new Promise((resolve, reject) => {
            http_1.default.get(serverUrl, (data) => {
                let str = '';
                data.on('data', (chunk) => {
                    str += chunk;
                });
                data.on('end', () => {
                    resolve(JSON.parse(str));
                });
                data.once('error', (err) => {
                    reject(err);
                });
            });
        });
        if (res.version === this.version)
            return;
        this.parse(res.version);
        Object.keys(res.files).forEach((file) => {
            const text = res.files[file];
            const fullPath = path_1.default.resolve(this.ssr.outputDirInServer, `remotes/${name}/${file}`);
            write_1.default.sync(fullPath, text);
        });
        const { serverVersion } = this;
        const varName = mf.getWebpackPublicPathVarName(name);
        const version = serverVersion ? `.${serverVersion}` : '';
        // /Volumes/work/github/genesis/examples/ssr-hub/dist/ssr-hub/server/remotes/ssr-home/exposes.13f20ccc.js
        global[varName] = path_1.default.resolve(this.ssr.outputDirInServer, `remotes/${name}/js/${mf.entryName}${version}.js`);
    }
    inject() {
        const { name, publicPath } = this.options;
        const { clientVersion, mf } = this;
        const version = clientVersion ? `.${clientVersion}` : '';
        const fullPath = publicPath + `/${name}/js/${mf.entryName}${version}.js`;
        const value = (0, serialize_javascript_1.default)(fullPath);
        const varName = mf.getWebpackPublicPathVarName(name);
        return `window["${varName}"] = ${value};`;
    }
}
class Exposes {
    constructor(ssr) {
        this.ssr = ssr;
    }
    get mf() {
        return MF.get(this.ssr);
    }
    async get(version = '') {
        const res = { version: '', files: {} };
        res.version = this.read(this.mf.outputExposesVersion).join(separator);
        if (res.version !== version) {
            res.files = this.read(this.mf.outputExposesFiles);
        }
        return res;
    }
    read(fullPath) {
        if (!fs_1.default.existsSync(fullPath)) {
            throw new Error(`${fullPath} file not found`);
        }
        const text = fs_1.default.readFileSync(fullPath, { encoding: 'utf-8' });
        return JSON.parse(text);
    }
}
class MFPlugin extends plugin_1.Plugin {
    constructor(ssr) {
        super(ssr);
        const mf = MF.get(ssr);
        this.remotes = mf.options.remotes.map((options) => new Remote(ssr, options));
    }
    getRemote() {
        return Promise.all(this.remotes.map((item) => {
            return item.get();
        }));
    }
    renderBefore(context) {
        const { remotes } = this;
        if (remotes.length) {
            const arr = remotes.map((item) => {
                return item.inject();
            });
            context.data.script += `<script>${arr.join('')}</script>`;
        }
    }
}
exports.MFPlugin = MFPlugin;
class MF {
    constructor(ssr, options = {}) {
        this.options = { remotes: [], exposes: {} };
        this.entryName = 'exposes';
        this.ssr = ssr;
        Object.assign(this.options, options);
        ssr[mf] = this;
        this.mfPlugin = new MFPlugin(ssr);
        this.exposes = new Exposes(ssr);
        ssr.plugin.use(this.mfPlugin);
    }
    static is(ssr) {
        return ssr[mf] instanceof MF;
    }
    static get(ssr) {
        return ssr[mf];
    }
    get name() {
        return ssr_1.SSR.fixVarName(this.ssr.name);
    }
    get outputExposesVersion() {
        return path_1.default.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-version.json');
    }
    get outputExposesFiles() {
        return path_1.default.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-files.json');
    }
    getWebpackPublicPathVarName(name) {
        return `__webpack_public_path_${this.name}_${ssr_1.SSR.fixVarName(name)}`;
    }
    getExposes(version) {
        return this.exposes.get(version);
    }
    getRemote() {
        return this.mfPlugin.getRemote();
    }
}
exports.MF = MF;
