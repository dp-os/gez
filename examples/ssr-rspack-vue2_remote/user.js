import http from 'node:http';
import * as vue from 'ssr-rspack-vue2_remote/vue';

console.log(http.createServer, '????????');

console.log('>>>>>>>>> import', vue.version);

function init() {
    import('ssr-rspack-vue2_remote/vue').then((m) => {
        console.log('>>>>>>>>> import()', m.version);
        console.log('>>>>> get meta', import.meta);
    });
}

export const user = {
    name: 'ok22222'
};
init();
