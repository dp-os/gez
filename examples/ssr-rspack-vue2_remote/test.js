// // import * as vue from "ssr-rspack-vue2_remote/vue";
// import vue from 'ssr-rspack-vue2_remote/vue';

// console.log('ok', vue);

// console.log(import.meta.resolve('ssr-rspack-vue2_remote/vue'), import.meta.url);

import { importEsmInactive } from '/Volumes/work/demo/import-esm/index.js';

console.log(import.meta);
console.log(await importEsmInactive('./user.js', import.meta.url));
