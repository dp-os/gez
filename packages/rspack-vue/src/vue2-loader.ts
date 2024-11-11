import type { rspack } from '@gez/rspack';
const FIX_ESM = `api.install(require('vue').default)`;
const ADD_IMPORT = `
function initImport () {
    const mixins = Array.isArray(component.options.mixins) ? component.options.mixins : [];
    mixins.push({
        created () {
            this.$ssrContext?.importMetaSet.add(import.meta);
        }
    });
    component.options.mixins = mixins;
}
initImport();
export default component.exports
`;

export default function (this: rspack.LoaderContext, text: string) {
    // 修复不支持热更新的 BUG
    text = text.replaceAll(`api.install(require('vue'))`, FIX_ESM);
    // 添加 CSS 依赖收集
    if (typeof this.target === 'string' && this.target.includes('node')) {
        text = text.replaceAll('export default component.exports', ADD_IMPORT);
    }
    return text;
}

export const vue2Loader = new URL(import.meta.resolve(import.meta.url))
    .pathname;
