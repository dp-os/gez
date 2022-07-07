import Ejs from 'ejs';
import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import serialize from 'serialize-javascript';
import Vue from 'vue';
import { createRenderer, Renderer as VueRenderer } from 'vue-server-renderer';
import write from 'write';

import type * as Genesis from './';
import { NodeVM } from './node-vm';
import { md5 } from './util';

const defaultTemplate = `<!DOCTYPE html><html><head><title>Vue SSR for Genesis</title><%-style%></head><body><%-html%><%-scriptState%><%-script%></body></html>`;

const modes: Genesis.RenderMode[] = [
    'ssr-html',
    'csr-html',
    'ssr-json',
    'csr-json'
];

async function createDefaultApp(renderContext: Genesis.RenderContext) {
    return new Vue({
        render(h) {
            return h('div');
        }
    });
}
function createRootNodeAttr(context: Genesis.RenderContext) {
    const { data, ssr } = context;
    const name = ssr.name;
    return `data-ssr-genesis-id="${data.id}" data-ssr-genesis-name="${name}"`;
}
async function template(strHtml: string, ctx: Genesis.RenderContext) {
    const { ssr } = ctx;
    const html = strHtml.replace(
        /^(<[A-z]([A-z]|[0-9])+)/,
        `$1 ${createRootNodeAttr(ctx)}`
    );
    const vueCtx: any = ctx;
    const resource = vueCtx
        .getPreloadFiles()
        .map((item: any): Genesis.RenderContextResource => {
            return {
                file: `${ssr.publicPath}${item.file}`,
                extension: item.extension
            };
        });
    const { data } = ctx;
    if (html === '<!---->') {
        data.html += `<div ${createRootNodeAttr(ctx)}></div>`;
    } else {
        data.html += html;
    }
    const baseUrl = serialize(ssr.cdnPublicPath + ssr.publicPath, {
        isJSON: false,
        ignoreFunction: true
    });
    data.script =
        `<script>window["${ssr.publicPathVarName}"] = ${baseUrl};</script>` +
        data.script +
        vueCtx.renderScripts();
    data.style += vueCtx.renderStyles();
    data.resource = [...data.resource, ...resource];
    (ctx as any)._subs.forEach((fn: Function) => fn(ctx));
    (ctx as any)._subs = [];
    return ctx.data;
}

export class Renderer {
    public ssr: Genesis.SSR;
    public clientManifest: Genesis.ClientManifest = {
        publicPath: '',
        all: [],
        initial: [],
        async: [],
        modules: {}
    };
    private renderer!: VueRenderer;
    /**
     * Render template functions
     */
    private compile!: Ejs.TemplateFunction;
    private _createApp = createDefaultApp;
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
        Object.defineProperty(ssr.sandboxGlobal, ssr.publicPathVarName, {
            enumerable: true,
            get: () => ssr.cdnPublicPath + ssr.publicPath
        });
        this._load();
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
    public reload() {
        this._load();
    }

    /**
     * Render JSON
     */
    public async renderJson(
        options: Genesis.RenderOptions<Genesis.RenderModeJson> = {
            mode: 'ssr-json'
        }
    ): Promise<Genesis.RenderResultJson> {
        options = { ...options };
        if (
            !options.mode ||
            ['ssr-json', 'csr-json'].indexOf(options.mode) === -1
        ) {
            options.mode = 'ssr-json';
        }
        return this.render(options) as Promise<Genesis.RenderResultJson>;
    }

    /**
     * Render HTML
     */
    public async renderHtml(
        options: Genesis.RenderOptions<Genesis.RenderModeHtml> = {
            mode: 'ssr-html'
        }
    ): Promise<Genesis.RenderResultHtml> {
        options = { ...options };
        if (
            !options.mode ||
            ['ssr-html', 'csr-html'].indexOf(options.mode) === -1
        ) {
            options.mode = 'ssr-html';
        }
        return this.render(options) as Promise<Genesis.RenderResultHtml>;
    }

    /**
     * General basic rendering function
     */
    public async render<T extends Genesis.RenderMode = Genesis.RenderMode>(
        options: Genesis.RenderOptions<T> = {}
    ): Promise<Genesis.RenderResult<T>> {
        const { ssr } = this;
        const context = this._createContext<T>(options);
        await ssr.plugin.callHook('renderBefore', context);
        switch (context.mode) {
            case 'ssr-html':
            case 'csr-html':
                return this._renderHtml(context, context.mode) as any;
            case 'ssr-json':
            case 'csr-json':
                return this._renderJson(context, context.mode) as any;
        }
    }

    /**
     * Rendering Middleware
     */
    public async renderMiddleware(
        req: IncomingMessage,
        res: ServerResponse,
        next: (err: any) => void
    ): Promise<void> {
        try {
            const result = await this.render({ req, res });
            res.setHeader('cache-control', 'max-age=0');
            switch (result.type) {
                case 'html':
                    res.setHeader('content-type', 'text/html; charset=utf-8');
                    res.write(result.data);
                    break;
                case 'json':
                    res.setHeader(
                        'content-type',
                        'application/json; charset=utf-8'
                    );
                    res.write(JSON.stringify(result.data));
                    break;
            }
            res.end();
        } catch (err) {
            next(err);
        }
    }

    private _createContext<T extends Genesis.RenderMode = Genesis.RenderMode>(
        options: Genesis.RenderOptions<T>
    ): Genesis.RenderContext {
        const context: Genesis.RenderContext = {
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
                autoMount: true
            },
            styleTagExtractCSS: options.styleTagExtractCSS ?? false,
            mode: 'ssr-html',
            renderHtml: () => this.compile(context.data),
            ssr: this.ssr,
            renderer: this,
            beforeRender: (cb) => {
                (context as any)._subs.push(cb);
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
                const scriptJSON: string = serialize(script, {
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
        if (
            options.state &&
            Object.prototype.toString.call(options.state) === '[object Object]'
        ) {
            context.data.state = options.state || {};
        }
        // set context data
        if (typeof options.url === 'string') {
            context.data.url = options.url;
        }
        if (typeof options.id === 'string') {
            context.data.id = options.id;
        } else {
            context.data.id = md5(`${context.data.name}-${context.data.url}`);
        }

        if (typeof options.name === 'string') {
            context.data.name = options.name;
        }
        if (typeof options.autoMount === 'boolean') {
            context.data.autoMount = options.autoMount;
        }

        return context;
    }

    private async _renderJson(
        context: Genesis.RenderContext,
        mode: Genesis.RenderModeJson
    ): Promise<Genesis.RenderResultJson> {
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
    }

    /**
     * Render HTML
     */
    private async _renderHtml(
        context: Genesis.RenderContext,
        mode: Genesis.RenderModeHtml
    ): Promise<Genesis.RenderResultHtml> {
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
    }

    /**
     * Static file public path
     */
    public get staticPublicPath() {
        return this.ssr.publicPath;
    }

    /**
     * Static file directory
     */
    public get staticDir() {
        return this.ssr.outputDirInClient;
    }

    /**
     * The server renders a JSON
     */
    private async _ssrToJson(
        context: Genesis.RenderContext
    ): Promise<Genesis.RenderData> {
        const vm = await this._createApp(context);
        await new Promise((resolve, reject) => {
            this.renderer.renderToString(vm, context, (err, data: any) => {
                if (err) {
                    return reject(err);
                } else if (typeof data !== 'object') {
                    reject(new Error('Vue no rendering results'));
                }
                resolve(data);
            });
        });
        await this.ssr.plugin.callHook('renderCompleted', context);
        this._styleTagExtractCSS(context);
        return context.data;
    }

    /**
     * The server renders a HTML
     */
    private async _ssrToString(
        context: Genesis.RenderContext
    ): Promise<string> {
        // #12426 https://github.com/vuejs/vue/pull/12426
        (context as any)._registeredComponents = new Set();
        await this._ssrToJson(context);
        return context.renderHtml();
    }

    /**
     * The client renders a JSON
     */
    private async _csrToJson(
        context: Genesis.RenderContext
    ): Promise<Genesis.RenderData> {
        const vm = await createDefaultApp(context);
        const data: Genesis.RenderData = (await this.renderer.renderToString(
            vm,
            context
        )) as any;
        data.html = `<div ${createRootNodeAttr(context)}></div>`;
        await this.ssr.plugin.callHook('renderCompleted', context);
        this._styleTagExtractCSS(context);
        return context.data;
    }

    /**
     * The client renders a HTML
     */
    private async _csrToString(
        context: Genesis.RenderContext
    ): Promise<string> {
        await this._csrToJson(context);
        return context.renderHtml();
    }

    private _styleTagExtractCSS(context: Genesis.RenderContext) {
        const { cdnPublicPath, publicPath, isProd } = this.ssr;
        if (!context.styleTagExtractCSS || !isProd) return;
        const info = styleTagExtractCSS(context.data.style);
        const filename = `first-screen-style/${md5(info.cssRules)}.css`;
        const url = `${cdnPublicPath}${publicPath}${filename}`;
        context.data.style =
            info.value +
            `<link rel="stylesheet" type="text/css" href="${url}">`;
        const fullFilename = path.resolve(this.ssr.outputDirInClient, filename);
        if (fs.existsSync(fullFilename)) {
            return;
        }
        write.sync(fullFilename, info.cssRules);
    }
    private _load() {
        const { ssr } = this;
        const renderOptions: any = {
            template: template as any,
            inject: false
        };
        this._createApp = createDefaultApp;
        if (fs.existsSync(ssr.outputServeAppFile)) {
            const vm = new NodeVM(ssr.outputServeAppFile, ssr.sandboxGlobal);
            this._createApp = (...args) => {
                const createApp = vm.require();
                return createApp['default'](...args);
            };
        }
        if (fs.existsSync(ssr.outputClientManifestFile)) {
            const text = fs.readFileSync(ssr.outputClientManifestFile, 'utf-8');
            if (text) {
                const clientManifest: Genesis.ClientManifest = JSON.parse(text);
                clientManifest.publicPath = ssr.cdnPublicPath + ssr.publicPath;
                if (!ssr.isProd) {
                    // fix https://github.com/fmfe/genesis/issues/71
                    removeHotUpdateFiles(clientManifest);
                }
                this.clientManifest = clientManifest;
            }
        }
        renderOptions.clientManifest = this.clientManifest;

        const ejsTemplate = fs.existsSync(this.ssr.templateFile)
            ? fs.readFileSync(this.ssr.outputTemplateFile, 'utf-8')
            : defaultTemplate;

        this.renderer = createRenderer(renderOptions);
        this.compile = Ejs.compile(ejsTemplate);
    }
}

function testHotUpdate(file: string) {
    return !/\.hot-update.js(on)?$/.test(file);
}

function removeHotUpdateFiles(manifest: Genesis.ClientManifest) {
    manifest.all = manifest.all.filter(testHotUpdate);
    manifest.async = manifest.async.filter(testHotUpdate);
    manifest.initial = manifest.initial.filter(testHotUpdate);
}

export function styleTagExtractCSS(value: string) {
    let cssRules = '';
    const newValue = value.replace(
        /<style[^>]*>([^<]*)<\/style>/g,
        ($1, $2) => {
            cssRules += $2;
            return '';
        }
    );

    return {
        cssRules,
        value: newValue
    };
}
