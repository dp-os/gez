"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerApp = exports.createClientApp = void 0;
const vue_1 = __importDefault(require("vue"));
exports.createClientApp = async (options) => {
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
    const { router } = vueOptions || {};
    if (router) {
        if (router._mode === 'abstract') {
            await router.push(clientOptions.url).catch((err) => {
                throw err ||
                    new Error(`router.push('${clientOptions.url}') error`);
            });
        }
        else {
            await router.replace(clientOptions.url).catch((err) => {
                throw err ||
                    new Error(`router.push('${clientOptions.url}') error`);
            });
        }
        await new Promise((resolve, reject) => {
            router.onReady(resolve, (err) => {
                reject(err || new Error('Vue router onReady error'));
            });
        });
    }
    const app = new vue_1.default({
        ...vueOptions,
        clientOptions,
        render(h) {
            return h(App);
        }
    });
    return app;
};
exports.createServerApp = async (options) => {
    if (!options.App) {
        throw new Error('options.App component cannot be empty');
    }
    if (!options.renderContext) {
        throw new Error('options.renderContext parameter cannot be empty');
    }
    const { App, renderContext, vueOptions } = options;
    const { router } = vueOptions || {};
    if (router) {
        await router.replace(renderContext.data.url).catch((err) => {
            throw err ||
                new Error(`router.replace('${renderContext.data.url}') error`);
        });
        await new Promise((resolve, reject) => {
            router.onReady(resolve, (err) => {
                reject(err || new Error('Vue router onReady error'));
            });
        });
    }
    const app = new vue_1.default({
        ...vueOptions,
        renderContext,
        render(h) {
            return h(App);
        }
    });
    return app;
};
