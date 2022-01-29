import serialize from 'serialize-javascript';
import { Plugin } from './plugin';
const mf = Symbol('mf');
function varName(name) {
    return name.replace(/\W/g, '_');
}
export class MFPlugin extends Plugin {
    renderBefore(context) {
        const { ssr } = this;
        const mf = MF.get(ssr);
        const { remotes } = mf;
        if (remotes.length) {
            const arr = remotes.map((item) => {
                const fullPath = item.publicPath +
                    `/${item.name}/js/${mf.entryName}.js`;
                const value = serialize(fullPath);
                const name = mf.getVarName(item.name);
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
        return varName(this.ssr.name);
    }
    get exposes() {
        return this.options?.exposes || {};
    }
    get remotes() {
        return this.options?.remotes || [];
    }
    getVarName(name) {
        return `__webpack_public_path_${this.name}_${varName(name)}`;
    }
    getExposes(version) { }
    getRemote() { }
}
