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
     * Client side rendering context
     */
    context: RenderContext;
    /**
     * Parameters of Vue
     */
    vueOptions?: ComponentOptions<Vue>;
}

export const createClientApp = async (options: CreateClientAppOptions) => {
    if (typeof options !== 'object') {
        throw new Error('Option cannot be empty');
    }
    const context = options.clientOptions;
    if (typeof options.clientOptions !== 'object') {
        throw new Error('Option.context cannot be empty');
    }
    const el = context.el;
    if (!el) {
        throw new Error('Server side DOM not found');
    }
    const { vueOptions, App } = options;
    const { router } = vueOptions || {};
    if (router) {
        await router.replace(context.url);
    }
    const app = new Vue({
        ...vueOptions,
        render(h) {
            return h(App);
        }
    });
    return app;
};

export const createServerApp = async (options: CreateServerAppOptions) => {
    if (!options.App) {
        throw new Error('options.App component cannot be empty');
    }
    if (!options.context) {
        throw new Error('options.context parameter cannot be empty');
    }
    const { App, context, vueOptions } = options;
    const { router } = (vueOptions as any) || {};
    if (router) {
        await router.replace(context.data.url);
    }
    const app = new Vue({
        ...vueOptions,
        render(h) {
            return h(App);
        }
    });
    return app;
};
