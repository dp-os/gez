import Vue, { ComponentOptions } from 'vue';
import { RenderContext } from '@fmfe/genesis-core';
export interface ClientContext {
    el: Element;
    url: string;
    state: {
        [x: string]: any;
    };
}
export declare type ServerContext = RenderContext;
export interface CreateClientAppOptions {
    /**
     * Root render component
     */
    App: typeof Vue;
    /**
     * Client side rendering context
     */
    context: ClientContext;
    /**
     * Parameters of Vue
     */
    vueOptions?: ComponentOptions<Vue>;
}
export interface CreateServerAppOptions {
    /**
     * Root render component
     */
    App: typeof Vue;
    /**
     * Client side rendering context
     */
    context: ServerContext;
    /**
     * Parameters of Vue
     */
    vueOptions?: ComponentOptions<Vue>;
}
export declare const createClientApp: (options: CreateClientAppOptions) => Promise<import("vue/types/vue").CombinedVueInstance<Vue, object, object, object, Record<never, any>>>;
export declare const createServerApp: (options: CreateServerAppOptions) => Promise<import("vue/types/vue").CombinedVueInstance<Vue, object, object, object, Record<never, any>>>;
