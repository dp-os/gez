import Vue, { ComponentOptions } from 'vue';
import { ClientOptions, RenderContext } from '@fmfe/genesis-core';
export interface CreateClientAppOptions {
    /**
     * Root render component
     */
    App: typeof Vue;
    /**
     * Client side rendering context
     */
    clientOptions: ClientOptions;
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
     * Server side rendering context
     */
    renderContext: RenderContext;
    /**
     * Parameters of Vue
     */
    vueOptions?: ComponentOptions<Vue>;
}
export declare const createClientApp: (options: CreateClientAppOptions) => Promise<import("vue/types/vue").CombinedVueInstance<Vue, object, object, object, Record<never, any>>>;
export declare const createServerApp: (options: CreateServerAppOptions) => Promise<import("vue/types/vue").CombinedVueInstance<Vue, object, object, object, Record<never, any>>>;
