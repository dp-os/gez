import serialize from 'serialize-javascript';

import type * as Genesis from '.';
import { Plugin } from './plugin';
import { SSR } from './ssr';

const mf = Symbol('mf');

export class MFPlugin extends Plugin {
    public renderBefore(context: Genesis.RenderContext): void {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const { remotes } = mf;
        if (remotes.length) {
            const arr = remotes.map((item) => {
                const fullPath =
                    item.publicPath + `/${item.name}/js/${mf.entryName}.js`;
                const value = serialize(fullPath);
                const name = mf.getWebpackPublicPathVarName(item.name);
                return `window["${name}"] = ${value};`;
            });
            context.data.script += `<script>${arr.join('')}</script>`;
        }
    }
}
export class MF {
    public static is(ssr: Genesis.SSR) {
        return ssr[mf] instanceof MF;
    }
    public static get(ssr: Genesis.SSR): MF {
        return ssr[mf]!;
    }
    public ssr: Genesis.SSR;
    public options: Genesis.MFOptions;
    public entryName = 'exposes';
    public constructor(ssr: Genesis.SSR, options: Genesis.MFOptions = {}) {
        this.ssr = ssr;
        this.options = options;
        ssr[mf] = this;
        ssr.plugin.use(MFPlugin);
    }
    public get name() {
        return SSR.fixVarName(this.ssr.name);
    }
    public get exposes() {
        return this.options?.exposes || {};
    }
    public get remotes() {
        return this.options?.remotes || [];
    }
    public getWebpackPublicPathVarName(name: string) {
        return `__webpack_public_path_${this.name}_${SSR.fixVarName(name)}`;
    }
    public getExposes(version: string) {}
    public getRemote() {}
}
