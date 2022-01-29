export class MF {
    constructor(ssr) {
        this.ssr = ssr;
    }
    static varName(name) {
        return name.replace(/\W/g, '_');
    }
    static exposesVarName(name, exposesEntryName) {
        return `__webpack_public_path_${this.varName(name)}_${exposesEntryName}`;
    }
    get name() {
        return MF.varName(this.ssr.name);
    }
    getExposes(version) { }
    getRemote() { }
}
