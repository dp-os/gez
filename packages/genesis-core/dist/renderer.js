"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const crypto_1 = __importDefault(require("crypto"));
const vue_server_renderer_1 = require("vue-server-renderer");
const md5 = (content) => {
    var md5 = crypto_1.default.createHash('md5');
    return md5.update(content).digest('hex');
};
const defaultTemplate = `<!DOCTYPE html><html><head><title>Vue SSR for Genesis</title><%-style%></head><body><%-html%><%-scriptState%><%-script%></body></html>`;
class Renderer {
    constructor(ssr, options) {
        var _a, _b, _c, _d;
        if (!((_a = options === null || options === void 0 ? void 0 : options.client) === null || _a === void 0 ? void 0 : _a.data) || !((_b = options === null || options === void 0 ? void 0 : options.server) === null || _b === void 0 ? void 0 : _b.data)) {
            throw new Error(`You have not built the application, please execute 'new Build(ssr).start()' build first`);
        }
        this.ssr = ssr;
        const template = async (strHtml, ctx) => {
            const html = strHtml.replace(/^(<[A-z]([A-z]|[0-9])+)/, `$1 data-ssr-genesis-id="${ctx.data.id}"`);
            const resource = ctx.getPreloadFiles().map((item) => {
                return {
                    file: `${this.ssr.publicPath}${item.file}`,
                    extension: item.extension
                };
            });
            const { data } = ctx;
            data.html += html;
            data.script += ctx.renderScripts();
            data.style += ctx.renderStyles();
            data.resource = [...data.resource, ...resource];
            return ctx.data;
        };
        const clientManifest = ((_c = options === null || options === void 0 ? void 0 : options.client) === null || _c === void 0 ? void 0 : _c.data) || require(this.ssr.outputClientManifestFile);
        const bundle = ((_d = options === null || options === void 0 ? void 0 : options.server) === null || _d === void 0 ? void 0 : _d.data) || require(this.ssr.outputServerBundleFile);
        const renderOptions = {
            template,
            inject: false,
            clientManifest: clientManifest,
            shouldPreload: () => true
        };
        const ejsTemplate = fs_1.default.existsSync(this.ssr.templaceFile)
            ? fs_1.default.readFileSync(this.ssr.outputTemplaceFile, 'utf-8')
            : defaultTemplate;
        this.ssrRenderer = vue_server_renderer_1.createBundleRenderer(bundle, {
            ...renderOptions,
            runInNewContext: 'once'
        });
        this.csrRenderer = vue_server_renderer_1.createRenderer(renderOptions);
        this.compile = ejs_1.default.compile(ejsTemplate);
        const bindArr = [
            'renderJson',
            'renderHtml',
            'render',
            'renderMiddleware'
        ];
        bindArr.forEach((k) => {
            this[k] = this[k].bind(this);
            Object.defineProperty(this, k, {
                enumerable: false
            });
        });
    }
    /**
     * Hot update
     */
    hotUpdate(options) {
        const renderer = new Renderer(this.ssr, options);
        this.csrRenderer = renderer.csrRenderer;
        this.compile = renderer.compile;
        this.ssrRenderer = renderer.ssrRenderer;
    }
    /**
     * Render JSON
     */
    async renderJson(req, res, mode = 'ssr-json') {
        const { ssr } = this;
        const modes = ['ssr-json', 'csr-json'];
        if (modes.indexOf(mode) === -1) {
            throw new TypeError(`Render mode can only be ${modes.join(' ')}`);
        }
        const context = this._createContext(ssr, {
            req,
            res,
            mode: mode
        });
        await ssr.plugin.callHook('renderBefore', context);
        return this._renderJson(context);
    }
    /**
     * Render HTML
     */
    async renderHtml(req, res, mode = 'ssr-html') {
        const { ssr } = this;
        const modes = ['ssr-html', 'csr-html'];
        if (modes.indexOf(mode) === -1) {
            throw new TypeError(`Render mode can only be ${modes.join(' ')}`);
        }
        const context = this._createContext(ssr, {
            req,
            res,
            mode: mode
        });
        await ssr.plugin.callHook('renderBefore', context);
        return this._renderHtml(context);
    }
    /**
     * General basic rendering function
     */
    async render(req, res, mode = 'ssr-html') {
        const { ssr } = this;
        const modes = [
            'ssr-html',
            'csr-html',
            'ssr-json',
            'csr-json'
        ];
        if (modes.indexOf(mode) === -1) {
            throw new TypeError(`Render mode can only be ${modes.join(' ')}`);
        }
        const context = this._createContext(ssr, {
            req,
            res,
            mode: mode
        });
        await ssr.plugin.callHook('renderBefore', context);
        switch (context.mode) {
            case 'ssr-html':
            case 'csr-html':
                return this._renderHtml(context);
            case 'ssr-json':
            case 'csr-json':
                return this._renderJson(context);
        }
    }
    /**
     * Rendering Middleware
     */
    async renderMiddleware(req, res, next) {
        try {
            const renderResult = await this.render(req, res);
            switch (renderResult.type) {
                case 'html':
                    res.setHeader('content-type', 'text/html; charset=utf-8');
                    res.setHeader('cache-control', 'max-age=0');
                    res.write(renderResult.data);
                    break;
                case 'json':
                    res.setHeader('content-type', 'application/json; charset=utf-8');
                    res.write(JSON.stringify(renderResult.data));
                    break;
            }
            res.end();
        }
        catch (err) {
            next(err);
        }
    }
    _createContext(ssr, context = {}) {
        var _a;
        if (!context.data) {
            context.data = {
                id: '',
                name: ssr.name,
                url: '',
                html: '',
                style: '',
                script: '',
                scriptState: '',
                state: {},
                resource: []
            };
        }
        if (!('mode' in context)) {
            context.mode = 'ssr-json';
        }
        if (context.req && !context.data.url) {
            context.data.url = context.req.url || '';
        }
        if (!((_a = context.data) === null || _a === void 0 ? void 0 : _a.id)) {
            context.data.id = md5(`${context.data.name}-${context.data.url}`);
        }
        if (!context.compile) {
            context.compile = this.compile;
        }
        if (!context.format) {
            context.format = new ssr.Format(this.ssr);
        }
        context.ssr = this.ssr;
        return context;
    }
    _mergeContextData(context, data) {
        const { format } = context;
        context.data.style = format.style(data);
        context.data.html = format.html(data);
        context.data.scriptState = format.scriptState(data);
        context.data.script = format.script(data);
        return context.data;
    }
    async _renderJson(context) {
        switch (context.mode) {
            case 'ssr-json':
                return {
                    type: 'json',
                    data: await this._ssrToJson(context),
                    context
                };
            case 'csr-json':
                return {
                    type: 'json',
                    data: await this._csrToJson(context),
                    context
                };
        }
    }
    /**
     * Render HTML
     */
    async _renderHtml(context) {
        switch (context.mode) {
            case 'ssr-html':
                return {
                    type: 'html',
                    data: await this._ssrToString(context),
                    context
                };
            case 'csr-html':
                return {
                    type: 'html',
                    data: await this._csrToString(context),
                    context
                };
        }
    }
    /**
     * Static file public path
     */
    get staticPublicPath() {
        return this.ssr.publicPath;
    }
    /**
     * Static file directory
     */
    get staticDir() {
        return this.ssr.staticDir;
    }
    /**
     * The server renders a JSON
     */
    async _ssrToJson(context) {
        const data = (await this.ssrRenderer.renderToString(context));
        this._mergeContextData(context, data);
        await this.ssr.plugin.callHook('renderCompleted', context);
        return context.data;
    }
    /**
     * The server renders a HTML
     */
    async _ssrToString(context) {
        await this._ssrToJson(context);
        return context.compile(context.data);
    }
    /**
     * The client renders a JSON
     */
    async _csrToJson(context) {
        const vm = new vue_1.default({
            render(h) {
                return h('div');
            }
        });
        const data = (await this.csrRenderer.renderToString(vm, context));
        data.html = `<div data-ssr-genesis-id="${data.id}" data-server-rendered="false"></div>`;
        this._mergeContextData(context, data);
        await this.ssr.plugin.callHook('renderCompleted', context);
        return context.data;
    }
    /**
     * The client renders a HTML
     */
    async _csrToString(context) {
        await this._csrToJson(context);
        return context.compile(context.data);
    }
}
exports.Renderer = Renderer;
