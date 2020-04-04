"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientApp = async (options) => {
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
    }
    else {
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
exports.createServerApp = async (options) => {
    if (!options.App) {
        throw new Error('options.App component cannot be empty');
    }
    if (!options.context) {
        throw new Error('options.context parameter cannot be empty');
    }
    const { App, context, vueOptions } = options;
    const { router } = vueOptions || {};
    if (router) {
        await router.replace(context.data.url);
    }
    const app = new App({
        ...vueOptions
    });
    return app;
};
