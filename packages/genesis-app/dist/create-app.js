"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
exports.createClientApp = async (options) => {
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
    const renderMode = el.getAttribute('data-server-rendered') || 'false';
    if (router && renderMode === 'true') {
        await router.replace(context.url);
    }
    else {
        el.removeAttribute('data-server-rendered');
    }
    const app = new vue_1.default({
        ...vueOptions,
        render(h) {
            return h(App);
        }
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
    const app = new vue_1.default({
        ...vueOptions,
        render(h) {
            return h(App);
        }
    });
    return app;
};
