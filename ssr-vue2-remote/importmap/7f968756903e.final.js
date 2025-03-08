(() => {
const base = document.currentScript.getAttribute('data-base');
const importmap = {"imports":{"ssr-vue2-remote\u002Fsrc\u002Fentry.client":"\u002Fssr-vue2-remote\u002Fsrc\u002Fentry.client.4d98460b.final.js","ssr-vue2-remote\u002Fnpm\u002Fvue":"\u002Fssr-vue2-remote\u002Fnpm\u002Fvue.01ac1108.final.js","ssr-vue2-remote\u002Fsrc\u002Fcomponents\u002Findex":"\u002Fssr-vue2-remote\u002Fsrc\u002Fcomponents\u002Findex.9e0a9df6.final.js","ssr-vue2-remote\u002Fsrc\u002Fcomposables\u002Findex":"\u002Fssr-vue2-remote\u002Fsrc\u002Fcomposables\u002Findex.5c38a5da.final.js","ssr-vue2-remote\u002Fsrc\u002Fexamples\u002Findex":"\u002Fssr-vue2-remote\u002Fsrc\u002Fexamples\u002Findex.532a2171.final.js","ssr-vue2-remote\u002Fsrc\u002Fcomponents":"\u002Fssr-vue2-remote\u002Fsrc\u002Fcomponents\u002Findex.9e0a9df6.final.js","ssr-vue2-remote\u002Fsrc\u002Fcomposables":"\u002Fssr-vue2-remote\u002Fsrc\u002Fcomposables\u002Findex.5c38a5da.final.js","ssr-vue2-remote\u002Fsrc\u002Fexamples":"\u002Fssr-vue2-remote\u002Fsrc\u002Fexamples\u002Findex.532a2171.final.js"}};
if (importmap.imports && base) {
    const imports = importmap.imports;
    Object.entries(imports).forEach(([k, v]) => {
        imports[k] = base + v;
    });
}
document.head.appendChild(Object.assign(document.createElement('script'), {
type: 'importmap',
innerHTML: JSON.stringify(importmap)
}));
})();