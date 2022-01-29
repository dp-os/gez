import type * as Genesis from '.';

const mf = Symbol('mf');

export class MF {
    public static varName(name: string) {
        return name.replace(/\W/g, '_');
    }
    public static exposesVarName(name: string, exposesEntryName: string) {
        return `__webpack_public_path_${this.varName(
            name
        )}_${exposesEntryName}`;
    }
    public static is(ssr: Genesis.SSR) {
        return ssr[mf] instanceof MF;
    }
    public static get(ssr: Genesis.SSR): MF {
        return ssr[mf]!;
    }
    public ssr: Genesis.SSR;
    public options: Genesis.MFOptions;
    public constructor(ssr: Genesis.SSR, options: Genesis.MFOptions = {}) {
        this.ssr = ssr;
        this.options = options;
        ssr[mf] = this;
    }
    public get name() {
        return MF.varName(this.ssr.name);
    }
    public get exposes() {
        return this.options?.exposes || {};
    }
    public get remotes() {
        return this.options?.remotes || [];
    }
    public getExposes(version: string) {}
    public getRemote() {}
}
