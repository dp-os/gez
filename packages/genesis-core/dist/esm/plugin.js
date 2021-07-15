export class Plugin {
    ssr;
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
    chainWebpack(config) { }
    /**
     * Modify the configuration of babel
     */
    babel(config) { }
    /**
     * Modify the configuration of postcss, See detail https://www.npmjs.com/package/postcss-loader
     */
    postcss(config) { }
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
export class PluginManage {
    /**
     * Current SSR instance
     */
    ssr;
    /**
     * List of installed plug-ins
     */
    plugins = [];
    constructor(ssr) {
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
     * Using a plug-in for SSR
     */
    unshift(P) {
        if (P instanceof Plugin) {
            this.plugins.unshift(P);
        }
        else {
            this.plugins.unshift(new P(this.ssr));
        }
        return this;
    }
    /**
     * Execute the hook of a plug-in asynchronously
     */
    async callHook(key, ...args) {
        for (const plugin of this.plugins) {
            await plugin[key](...args);
        }
    }
}
