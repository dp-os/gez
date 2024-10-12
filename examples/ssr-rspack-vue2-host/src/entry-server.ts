import type { ServerContext } from '@gez/core';
import { log } from 'ssr-rspack-vue2-remote/src/utils/index';
import Vue from 'vue';

export default (ctx: ServerContext) => {
    ctx.html = '3222242344' + Vue.version;
    log();
};
