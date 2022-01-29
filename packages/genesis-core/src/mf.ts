import type * as Genesis from '.';

export class MF {
    public static varName(name: string) {
        return name.replace(/\W/g, '_');
    }
    public static exposesVarName(name: string, exposesEntryName: string) {
        return `__webpack_public_path_${this.varName(name)}_${exposesEntryName}`
    }
    public ssr: Genesis.SSR;
    public constructor (ssr: Genesis.SSR) {
        this.ssr = ssr;
    }
    public get name() {
        return MF.varName(this.ssr.name);
    }
    public getExposes(version: string) {}
    public getRemote() {}
}