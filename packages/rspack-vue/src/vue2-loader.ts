export default function (text: string) {
    // 修复 vue-loader 不支持 ESM 的 BUG。
    return text.replaceAll(
        `api.install(require('vue'))`,
        `api.install(require('vue').default)`
    );
}
