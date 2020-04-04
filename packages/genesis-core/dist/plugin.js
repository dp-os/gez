"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor(ssr) {
        this.ssr = ssr;
    }
    /**
     * Execute before building production environment
     */
    beforeCompiler(type) { }
    /**
     * Add plug-in of webpack or change configuration of webpack
     */
    webpackConfig(config) { }
    /**
     * Execute after building production environment
     */
    afterCompiler(type) { }
    /**
     * Execute before rendering Middleware
     */
    renderBefore(context) { }
    /**
     * SSR rendering complete execution
     */
    renderCompleted(context) { }
}
exports.Plugin = Plugin;
class PluginManage {
    constructor(ssr) {
        /**
         * List of installed plug-ins
         */
        this.plugins = [];
        this.ssr = ssr;
    }
    /**
     * Using a plug-in for SSR
     */
    use(P) {
        if (P instanceof Plugin) {
            this.plugins.push(P);
        }
        else {
            this.plugins.push(new P(this.ssr));
        }
        return this;
    }
    /**
     * Execute the hook of a plug-in asynchronously
     */
    callHook(key, ...args) {
        const p = Promise.resolve();
        this.plugins.forEach((plugin) => {
            p.then(() => {
                return plugin[key](...args);
            });
        });
        return p;
    }
}
exports.PluginManage = PluginManage;
