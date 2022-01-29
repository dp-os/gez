"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MF = exports.MFPlugin = void 0;
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
const plugin_1 = require("./plugin");
const mf = Symbol('mf');
function varName(name) {
    return name.replace(/\W/g, '_');
}
class MFPlugin extends plugin_1.Plugin {
    renderBefore(context) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const { remotes } = mf;
        if (remotes.length) {
            const arr = remotes.map((item) => {
                const fullPath = item.publicPath +
                    `/${item.name}/js/${mf.entryName}.js`;
                const value = (0, serialize_javascript_1.default)(fullPath);
                const name = mf.getVarName(item.name);
                return `window["${name}"] = ${value};`;
            });
            context.data.script += `<script>${arr.join('')}</script>`;
        }
    }
}
exports.MFPlugin = MFPlugin;
class MF {
    constructor(ssr, options = {}) {
        this.entryName = 'exposes';
        this.ssr = ssr;
        this.options = options;
        ssr[mf] = this;
        ssr.plugin.use(MFPlugin);
    }
    static is(ssr) {
        return ssr[mf] instanceof MF;
    }
    static get(ssr) {
        return ssr[mf];
    }
    get name() {
        return varName(this.ssr.name);
    }
    get exposes() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.exposes) || {};
    }
    get remotes() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.remotes) || [];
    }
    getVarName(name) {
        return `__webpack_public_path_${this.name}_${varName(name)}`;
    }
    getExposes(version) { }
    getRemote() { }
}
exports.MF = MF;
