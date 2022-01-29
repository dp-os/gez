const mf = Symbol('mf');
export class MF {
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
        return this.options?.exposes || {};
    }
    get remotes() {
        return this.options?.remotes || [];
    }
    getExposes(version) { }
    getRemote() { }
}
