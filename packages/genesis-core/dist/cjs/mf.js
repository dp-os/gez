"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MF = void 0;
const mf = Symbol('mf');
class MF {
    constructor(ssr, options = {}) {
        this.ssr = ssr;
        this.options = options;
        ssr[mf] = this;
    }
    static varName(name) {
        return name.replace(/\W/g, '_');
    }
    static exposesVarName(name, exposesEntryName) {
        return `__webpack_public_path_${this.varName(name)}_${exposesEntryName}`;
    }
    static is(ssr) {
        return ssr[mf] instanceof MF;
    }
    static get(ssr) {
        return ssr[mf];
    }
    get name() {
        return MF.varName(this.ssr.name);
    }
    get exposes() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.exposes) || {};
    }
    get remotes() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.remotes) || [];
    }
    getExposes(version) { }
    getRemote() { }
}
exports.MF = MF;
