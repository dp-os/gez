import crypto from 'crypto';
import Ejs from 'ejs';
import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import serialize from 'serialize-javascript';
import Vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
const md5 = (content) => {
    const md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
};
const defaultTemplate = `<!DOCTYPE html><html><head><title>Vue SSR for Genesis</title><%-style%></head><body><%-html%><%-scriptState%><%-script%></body></html>`;
const modes = [
    'ssr-html',
    'csr-html',
    'ssr-json',
    'csr-json'
];
async function createDefaultApp(renderContext) {
    return new Vue({
        render(h) {
            return h('div');
        }
    });
}
function createRootNodeAttr(context) {
    const { data, ssr } = context;
    const name = ssr.name;
    return `data-ssr-genesis-id="${data.id}" data-ssr-genesis-name="${name}"`;
}
async function template(strHtml, ctx) {
    const { ssr } = ctx;
    const html = strHtml.replace(/^(<[A-z]([A-z]|[0-9])+)/, `$1 ${createRootNodeAttr(ctx)}`);
    const vueCtx = ctx;
    const resource = vueCtx
        .getPreloadFiles()
        .map((item) => {
        return {
            file: `${ssr.publicPath}${item.file}`,
            extension: item.extension
        };
    });
    const { data } = ctx;
    if (html === '<!---->') {
        data.html += `<div ${createRootNodeAttr(ctx)}></div>`;
    }
    else {
        data.html += html;
    }
    const baseUrl = serialize(ssr.cdnPublicPath + ssr.publicPath, {
        isJSON: false,
        ignoreFunction: true
    });
    data.script =
        `<script>window["${ssr.publicPathName}"] = ${baseUrl};</script>` +
            data.script +
            vueCtx.renderScripts();
    data.style += vueCtx.renderStyles();
    data.resource = [...data.resource, ...resource];
    ctx._subs.forEach((fn) => fn(ctx));
    ctx._subs = [];
    return ctx.data;
}
export class Renderer {
    constructor(ssr) {
        this.clientManifest = {
            publicPath: '',
            all: [],
            initial: [],
            async: [],
            modules: {}
        };
        this._createApp = createDefaultApp;
        this.ssr = ssr;
        this.reload();
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
     * Reload the renderer
     */
    reload() {
        const { ssr } = this;
        if (this.renderer) {
            Object.keys(require.cache).forEach((filename) => {
                if (filename.indexOf(ssr.outputDirInServer) === 0) {
                    delete require.cache[filename];
                }
            });
        }
        global[ssr.publicPathName] = ssr.cdnPublicPath + ssr.publicPath;
        const renderOptions = {
            template: template,
            inject: false
        };
        if (fs.existsSync(ssr.outputServeAppFile)) {
            this._createApp = (...args) => {
                return require(ssr.outputServeAppFile)['default'](...args);
            };
        }
        else {
            this._createApp = createDefaultApp;
        }
        if (fs.existsSync(ssr.outputClientManifestFile)) {
            const text = fs.readFileSync(ssr.outputClientManifestFile, 'utf-8');
            const clientManifest = JSON.parse(text);
            clientManifest.publicPath = ssr.cdnPublicPath + ssr.publicPath;
            this.clientManifest = clientManifest;
        }
        renderOptions.clientManifest = this.clientManifest;
        const ejsTemplate = fs.existsSync(this.ssr.templateFile)
            ? fs.readFileSync(this.ssr.outputTemplateFile, 'utf-8')
            : defaultTemplate;
        this.renderer = createRenderer(renderOptions);
        this.compile = Ejs.compile(ejsTemplate);
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
                const scriptJSON = serialize(script, {
                    isJSON: true
                });
                return `<script data-ssr-genesis-name="${data.name}" data-ssr-genesis-id="${data.id}">window["${data.id}"]=${scriptJSON};</script>`;
            }
        });
        // set context
        if (options.req instanceof IncomingMessage) {
            context.req = options.req;
            if (typeof context.req.url === 'string') {
                context.data.url = context.req.url;
            }
        }
        if (options.res instanceof ServerResponse) {
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
        const vm = await this._createApp(context);
        await new Promise((resolve, reject) => {
            this.renderer.renderToString(vm, context, (err, data) => {
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
        // #12426 https://github.com/vuejs/vue/pull/12426
        context._registeredComponents = new Set();
        await this._ssrToJson(context);
        return context.renderHtml();
    }
    /**
     * The client renders a JSON
     */
    async _csrToJson(context) {
        const vm = await createDefaultApp(context);
        const data = (await this.renderer.renderToString(vm, context));
        data.html = `<div ${createRootNodeAttr(context)}></div>`;
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
}
