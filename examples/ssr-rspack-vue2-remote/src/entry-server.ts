import type { ServerContext } from '@gez/core';

import { log } from 'ssr-rspack-vue2_remote/src/utils/index';
// import { log } from './utils/index';

export default (ctx: ServerContext) => {
    log('test');
    ctx.html = '231323';
};
