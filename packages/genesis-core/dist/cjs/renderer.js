"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
const vue_1 = __importDefault(require("vue"));
const vue_server_renderer_1 = require("vue-server-renderer");
const ssr_1 = require("./ssr");
const md5 = (content) => {
    const md5 = crypto_1.default.createHash('md5');
    return md5.update(content).digest('hex');
};
const defaultTemplate = `<!DOCTYPE html><html><head><title>Vue SSR for Genesis</title><%-style%></head><body><%-html%><%-scriptState%><%-script%></body></html>`;
const modes = [
    'ssr-html',
    'csr-html',
    'ssr-json',
    'csr-json'
];
class Renderer {
    constructor(ssr, options) {
        var _a, _b, _c, _d;
        if ((!((_a = options === null || options === void 0 ? void 0 : options.client) === null || _a === void 0 ? void 0 : _a.data) || !((_b = options === null || options === void 0 ? void 0 : options.server) === null || _b === void 0 ? void 0 : _b.data)) &&
            (!fs_1.default.existsSync(ssr.outputClientManifestFile) ||
                !fs_1.default.existsSync(ssr.outputServerBundleFile))) {
            ssr = new ssr_1.SSR({
                build: {
                    outputDir: path_1.default.resolve(__dirname, /src$/.test(__dirname)
                        ? '../dist/ssr-genesis'
                        : '../ssr-genesis')
                }
            });
            console.warn(`You have not built the application, please execute 'new Build(ssr).start()' build first, Now use the default`);
        }
        this.ssr = ssr;
        const template = async (strHtml, ctx) => {
            const html = strHtml.replace(/^(<[A-z]([A-z]|[0-9])+)/, `$1 ${this._createRootNodeAttr(ctx)}`);
            const vueCtx = ctx;
            const resource = vueCtx
                .getPreloadFiles()
                .map((item) => {
                return {
                    file: `${this.ssr.publicPath}${item.file}`,
                    extension: item.extension
                };
            });
            const { data } = ctx;
            if (html === '<!---->') {
                data.html += `<div ${this._createRootNodeAttr(ctx)}></div>`;
            }
            else {
                data.html += html;
            }
            const baseUrl = encodeURIComponent(ssr.cdnPublicPath + ssr.publicPath);
            data.script =
                `<script>window["__webpack_public_path_${ssr.name}__"] = "${baseUrl}";</script>` +
                    data.script +
                    vueCtx.renderScripts();
            data.style += vueCtx.renderStyles();
            data.resource = [...data.resource, ...resource];
            ctx._subs.forEach((fn) => fn(ctx));
            ctx._subs = [];
            return ctx.data;
        };
        const clientManifest = ((_c = options === null || options === void 0 ? void 0 : options.client) === null || _c === void 0 ? void 0 : _c.data) || { ...require(this.ssr.outputClientManifestFile) };
        const bundle = ((_d = options === null || options === void 0 ? void 0 : options.server) === null || _d === void 0 ? void 0 : _d.data) || {
            ...require(this.ssr.outputServerBundleFile)
        };
        clientManifest.publicPath =
            ssr.cdnPublicPath + clientManifest.publicPath;
        const renderOptions = {
            template,
            inject: false,
            clientManifest
        };
        const ejsTemplate = fs_1.default.existsSync(this.ssr.templateFile)
            ? fs_1.default.readFileSync(this.ssr.outputTemplateFile, 'utf-8')
            : defaultTemplate;
        this.ssrRenderer = (0, vue_server_renderer_1.createBundleRenderer)(bundle, {
            ...renderOptions,
            runInNewContext: 'once'
        });
        this.csrRenderer = (0, vue_server_renderer_1.createRenderer)(renderOptions);
        this.clientManifest = clientManifest;
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
        process.env[`__webpack_public_path_${ssr.name}__`] =
            ssr.cdnPublicPath + ssr.publicPath;
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
    async renderJson(options = {
        mode: 'ssr-json'
    }) {
        options = { ...options };
        if (!options.mode ||
            ['ssr-json', 'csr-json'].indexOf(options.mode) === -1) {
            options.mode = 'ssr-json';
        }
        return this.render(options);
    }
    /**
     * Render HTML
     */
    async renderHtml(options = {
        mode: 'ssr-html'
    }) {
        options = { ...options };
        if (!options.mode ||
            ['ssr-html', 'csr-html'].indexOf(options.mode) === -1) {
            options.mode = 'ssr-html';
        }
        return this.render(options);
    }
    /**
     * General basic rendering function
     */
    async render(options = {}) {
        const { ssr } = this;
        const context = this._createContext(options);
        await ssr.plugin.callHook('renderBefore', context);
        switch (context.mode) {
            case 'ssr-html':
            case 'csr-html':
                return this._renderHtml(context, context.mode);
            case 'ssr-json':
            case 'csr-json':
                return this._renderJson(context, context.mode);
        }
    }
    /**
     * Rendering Middleware
     */
    async renderMiddleware(req, res, next) {
        try {
            const result = await this.render({ req, res });
            res.setHeader('cache-control', 'max-age=0');
            switch (result.type) {
                case 'html':
                    res.setHeader('content-type', 'text/html; charset=utf-8');
                    res.write(result.data);
                    break;
                case 'json':
                    res.setHeader('content-type', 'application/json; charset=utf-8');
                    res.write(JSON.stringify(result.data));
                    break;
            }
            res.end();
        }
        catch (err) {
            next(err);
        }
    }
    _createContext(options) {
        const context = {
            env: 'server',
            data: {
                id: '',
                name: this.ssr.name,
                url: '/',
                html: '',
                style: '',
                script: '',
                scriptState: '',
                state: {},
                resource: [],
                automount: true
            },
            mode: 'ssr-html',
            renderHtml: () => this.compile(context.data),
            ssr: this.ssr,
            beforeRender: (cb) => {
                context._subs.push(cb);
            }
        };
        Object.defineProperty(context, '_subs', {
            enumerable: false,
            value: [],
            writable: true
        });
        Object.defineProperty(context.data, 'scriptState', {
            enumerable: false,
            get() {
                const data = context.data;
                const script = { ...data, env: 'client' };
                const arr = [
                    'style',
                    'html',
                    'scriptState',
                    'script',
                    'resource'
                ];
                arr.forEach((k) => {
                    Object.defineProperty(script, k, {
                        enumerable: false
                    });
                });
                const scriptJSON = (0, serialize_javascript_1.default)(script, {
                    isJSON: true
                });
                return `<script data-ssr-genesis-name="${data.name}" data-ssr-genesis-id="${data.id}">window["${data.id}"]=${scriptJSON};</script>`;
            }
        });
        // set context
        if (options.req instanceof http_1.IncomingMessage) {
            context.req = options.req;
            if (typeof context.req.url === 'string') {
                context.data.url = context.req.url;
            }
        }
        if (options.res instanceof http_1.ServerResponse) {
            context.res = options.res;
        }
        if (options.mode && modes.indexOf(options.mode) > -1) {
            context.mode = options.mode;
        }
        if (options.state &&
            Object.prototype.toString.call(options.state) === '[object Object]') {
            context.data.state = options.state || {};
        }
        // set context data
        if (typeof options.url === 'string') {
            context.data.url = options.url;
        }
        if (typeof options.id === 'string') {
            context.data.id = options.id;
        }
        else {
            context.data.id = md5(`${context.data.name}-${context.data.url}`);
        }
        if (typeof options.name === 'string') {
            context.data.name = options.name;
        }
        if (typeof options.automount === 'boolean') {
            context.data.automount = options.automount;
        }
        return context;
    }
    async _renderJson(context, mode) {
        switch (mode) {
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
        throw new TypeError(`No type ${context.mode}`);
    }
    /**
     * Render HTML
     */
    async _renderHtml(context, mode) {
        switch (mode) {
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
        throw new TypeError(`No type ${context.mode}`);
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
        await new Promise((resolve, reject) => {
            this.ssrRenderer.renderToString(context, (err, data) => {
                if (err) {
                    return reject(err);
                }
                else if (typeof data !== 'object') {
                    reject(new Error('Vue no rendering results'));
                }
                resolve(data);
            });
        });
        await this.ssr.plugin.callHook('renderCompleted', context);
        return context.data;
    }
    /**
     * The server renders a HTML
     */
    async _ssrToString(context) {
        await this._ssrToJson(context);
        return context.renderHtml();
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
        data.html = `<div ${this._createRootNodeAttr(context)}></div>`;
        await this.ssr.plugin.callHook('renderCompleted', context);
        return context.data;
    }
    /**
     * The client renders a HTML
     */
    async _csrToString(context) {
        await this._csrToJson(context);
        return context.renderHtml();
    }
    _createRootNodeAttr(context) {
        const { data, ssr } = context;
        const name = ssr.name;
        return `data-ssr-genesis-id="${data.id}" data-ssr-genesis-name="${name}"`;
    }
}
exports.Renderer = Renderer;
