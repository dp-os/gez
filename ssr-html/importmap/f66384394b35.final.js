(() => {
const base = document.currentScript.getAttribute('data-base');
const importmap = {"imports":{"ssr-html\u002Fsrc\u002Fentry.client":"\u002Fssr-html\u002Fsrc\u002Fentry.client.c9af1020.final.js","ssr-html\u002Fsrc\u002Ftitle\u002Findex":"\u002Fssr-html\u002Fsrc\u002Ftitle\u002Findex.2d79c0c2.final.js","ssr-html\u002Fsrc\u002Ftitle":"\u002Fssr-html\u002Fsrc\u002Ftitle\u002Findex.2d79c0c2.final.js"}};
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