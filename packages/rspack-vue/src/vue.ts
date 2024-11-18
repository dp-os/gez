import type { Gez } from '@gez/core';
import type { RspackHtmlAppOptions } from '@gez/rspack';
import { createRspackVueApp } from './vue-core';

export interface RspackVueAppOptions extends RspackHtmlAppOptions {
    /**
     * 透传 https://github.com/vuejs/vue-loader
     */
    vueLoader?: Record<string, any>;
}

export function createRspackVue2App(gez: Gez, options?: RspackVueAppOptions) {
    return createRspackVueApp(gez, '2', options);
}

export function createRspackVue3App(gez: Gez, options?: RspackVueAppOptions) {
    return createRspackVueApp(gez, '3', options);
}
