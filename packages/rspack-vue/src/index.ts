import type { Gez } from '@gez/core';
import { type RspackVueAppOptions, createRspackVueApp } from './vue';

export type { RspackVueAppOptions };

export function createRspackVue2App(gez: Gez, options?: RspackVueAppOptions) {
    return createRspackVueApp(gez, '2', options);
}

export function createRspackVue3App(gez: Gez, options?: RspackVueAppOptions) {
    return createRspackVueApp(gez, '3', options);
}
