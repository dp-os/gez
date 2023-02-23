import { ClientOptions, RenderContext } from '@fmfe/genesis-core';
import Vue, { Component, ComponentOptions } from 'vue';

export interface CreateClientAppOptions {
    /**
     * Root render component
     */
    App: typeof Vue | Component;
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
    App: typeof Vue | Component;
    /**
     * Server side rendering context
     */
    renderContext: RenderContext;
    /**
     * Parameters of Vue
     */
    vueOptions?: ComponentOptions<Vue>;
}

export const createClientApp = async (options: CreateClientAppOptions) => {
    if (typeof options !== 'object') {
        throw new Error('Option cannot be empty');
    }
    const clientOptions = options.clientOptions;
    if (typeof options.clientOptions !== 'object') {
        throw new Error('Option.clientOptions cannot be empty');
    }
    const el = clientOptions.el;
    if (!el) {
        throw new Error('Server side DOM not found');
    }
    const { vueOptions, App } = options;
    const { router }: any = vueOptions || {};
    if (router) {
        if ((router as any).sourceMode === 'abstract') {
            await router.push(clientOptions.url).catch((err: Error) => {
                throw err || new Error(`router.push('${clientOptions.url}') error`);
            });
        } else {
            await router.replace(clientOptions.url).catch((err: Error) => {
                throw err || new Error(`router.replace('${clientOptions.url}') error`);
            });
        }
        await new Promise((resolve, reject) => {
            router.onReady(resolve, (err: Error) => {
                reject(err || new Error('Vue router onReady error'));
            });
        });
    }
    const app = new Vue({
        ...vueOptions,
        // @ts-ignore
        clientOptions,
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
    if (!options.renderContext) {
        throw new Error('options.renderContext parameter cannot be empty');
    }
    const { App, renderContext, vueOptions } = options;
    const { router } = (vueOptions as any) || {};
    if (router) {
        await router.replace(renderContext.data.url).catch((err: Error) => {
            throw err || new Error(`router.replace('${renderContext.data.url}') error`);
        });
        await new Promise((resolve, reject) => {
            router.onReady(resolve, (err: Error) => {
                reject(err || new Error('Vue router onReady error'));
            });
        });
    }
    const app = new Vue({
        ...vueOptions,
        // @ts-ignore
        renderContext,
        render(h) {
            return h(App);
        }
    });
    return app;
};
