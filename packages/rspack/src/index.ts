export {
    type RspackAppConfigContext,
    type RspackAppOptions,
    createRspackApp
} from './app';
export { createRspackHtmlApp, type RspackHtmlAppOptions } from './html-app';
export { type BuildTarget } from './build-target';

import * as rspack from '@rspack/core';

export { rspack };
