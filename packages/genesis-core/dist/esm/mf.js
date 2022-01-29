import path from 'path';
import serialize from 'serialize-javascript';
import { Plugin } from './plugin';
import { SSR } from './ssr';
const mf = Symbol('mf');
export class MFPlugin extends Plugin {
    renderBefore(context) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const { remotes } = mf;
        if (remotes.length) {
            const arr = remotes.map((item) => {
                const fullPath = item.publicPath + `/${item.name}/js/${mf.entryName}.js`;
                const value = serialize(fullPath);
                const name = mf.getWebpackPublicPathVarName(item.name);
                return `window["${name}"] = ${value};`;
            });
            context.data.script += `<script>${arr.join('')}</script>`;
        }
    }
}
export class MF {
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
        return SSR.fixVarName(this.ssr.name);
    }
    get exposes() {
        return this.options?.exposes || {};
    }
    get remotes() {
        return this.options?.remotes || [];
    }
    get outputExposesInfo() {
        return path.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-info.json');
    }
    get outputExposesFiles() {
        return path.resolve(this.ssr.outputDirInServer, 'vue-ssr-server-exposes-files.json');
    }
    getWebpackPublicPathVarName(name) {
        return `__webpack_public_path_${this.name}_${SSR.fixVarName(name)}`;
    }
    getExposes(version) { }
    getRemote() { }
}
