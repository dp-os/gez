import Vue, { ComponentOptions } from 'vue';
import { RenderContext } from '@fmfe/genesis-core';

export interface ClientContext {
    el: Element;
    url: string;
    state: {
        [x: string]: any;
    };
}

export type ServerContext = RenderContext;

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

export const createClientApp = async (options: CreateClientAppOptions) => {
    if (typeof options !== 'object') {
        throw new Error('Option cannot be empty');
    }
    const context = options.context;
    if (typeof options.context !== 'object') {
        throw new Error('Option.context cannot be empty');
    }
    const el = context.el;
    if (!el) {
        throw new Error('Server side DOM not found');
    }
    const { vueOptions, App } = options;
    const { router } = vueOptions || {};
    const renderMode = el.getAttribute('data-server-rendered') || 'false';
    if (router && renderMode === 'true') {
        await router.replace(context.url);
    } else {
        el.removeAttribute('data-server-rendered');
    }
    const app = new App({
        el,
        ...vueOptions
    });
    if (router && renderMode !== 'true') {
        await router.replace(context.url);
    }
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
    const app = new App({
        ...vueOptions
    });
    return app;
};
