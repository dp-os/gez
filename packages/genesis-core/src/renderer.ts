import Vue from 'vue';
import fs from 'fs';
import { ServerResponse, IncomingMessage } from 'http';
import Ejs from 'ejs';
import crypto from 'crypto';
import * as Genesis from './';

import {
    createRenderer,
    Renderer as VueRenderer,
    BundleRenderer,
    createBundleRenderer
} from 'vue-server-renderer';

const md5 = (content: string) => {
    var md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
};

const defaultTemplate = `<!DOCTYPE html><html><head><title>Vue SSR for Genesis</title><%-style%></head><body><%-html%><%-scriptState%><%-script%></body></html>`;

export class Renderer {
    public ssr: Genesis.SSR;
    /**
     * Client side renderer
     */
    private csrRenderer: VueRenderer;
    /**
     * Render template functions
     */
    private compile: Ejs.TemplateFunction;
    /**
     * Server side renderer
     */
    private ssrRenderer: BundleRenderer;
    public constructor(ssr: Genesis.SSR, options?: Genesis.RendererOptions) {
        this.ssr = ssr;
        const template: any = async (
            strHtml: string,
            ctx: Genesis.RenderContext
        ): Promise<Genesis.RenderData> => {
            const html = strHtml.replace(
                /^(<[A-z]([A-z]|[0-9])+)/,
                `$1 data-ssr-genesis-id="${ctx.data.id}"`
            );
            const resource = ctx.getPreloadFiles().map(
                (item): Genesis.RenderContextResource => {
                    return {
                        file: `${this.ssr.publicPath}${item.file}`,
                        extension: item.extension
                    };
                }
            );
            const { data } = ctx;
            data.html += html;
            data.script += ctx.renderScripts();
            data.style += ctx.renderStyles();
            data.resource = [...data.resource, ...resource];
            return ctx.data;
        };

        const clientManifest =
            options?.client?.data || require(this.ssr.outputClientManifestFile);
        const bundle =
            options?.server?.data || require(this.ssr.outputServerBundleFile);
        const renderOptions = {
            template,
            inject: false,
            clientManifest: clientManifest,
            shouldPreload: () => true
        };

        const ejsTemplate = fs.existsSync(this.ssr.templaceFile)
            ? fs.readFileSync(this.ssr.outputTemplaceFile, 'utf-8')
            : defaultTemplate;

        this.ssrRenderer = createBundleRenderer(bundle, {
            ...renderOptions,
            runInNewContext: 'once'
        });
        this.csrRenderer = createRenderer(renderOptions);
        this.compile = Ejs.compile(ejsTemplate);

        const bindArr = [
            'renderJson',
            'renderHtml',
            'render',
            'renderMiddleware',
            'createContext'
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
    public hotUpdate(options?: Genesis.RendererOptions) {
        const renderer = new Renderer(this.ssr, options);
        this.csrRenderer = renderer.csrRenderer;
        this.compile = renderer.compile;
        this.ssrRenderer = renderer.ssrRenderer;
    }

    /**
     * Render JSON
     */
    public async renderJson(
        req: IncomingMessage,
        res: ServerResponse,
        mode: Genesis.RenderModeJson = 'ssr-json'
    ): Promise<Genesis.RenderResultJson> {
        const { ssr } = this;
        const modes: Genesis.RenderMode[] = ['ssr-json', 'csr-json'];
        if (modes.indexOf(mode) === -1) {
            throw new TypeError(`Render mode can only be ${modes.join(' ')}`);
        }
        const context = this._createContext(ssr, {
            req,
            res,
            mode: mode
        });
        await ssr.plugin.callHook('renderBefore', context as any);
        return this._renderJson(context);
    }

    /**
     * Render HTML
     */
    public async renderHtml(
        req: IncomingMessage,
        res: ServerResponse,
        mode: Genesis.RenderMode = 'ssr-html'
    ): Promise<Genesis.RenderResultHtml> {
        const { ssr } = this;
        const modes: Genesis.RenderMode[] = ['ssr-html', 'csr-html'];
        if (modes.indexOf(mode) === -1) {
            throw new TypeError(`Render mode can only be ${modes.join(' ')}`);
        }
        const context = this._createContext(ssr, {
            req,
            res,
            mode: mode
        });
        await ssr.plugin.callHook('renderBefore', context as any);
        return this._renderHtml(context);
    }

    /**
     * General basic rendering function
     */
    public async render(
        req: IncomingMessage,
        res: ServerResponse,
        mode: Genesis.RenderMode = 'ssr-html'
    ): Promise<Genesis.RenderResul> {
        const { ssr } = this;
        const modes: Genesis.RenderMode[] = [
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
    public async renderMiddleware(
        req: IncomingMessage,
        res: ServerResponse,
        next: (err: any) => void
    ): Promise<void> {
        try {
            const renderResult = await this.render(req, res);
            switch (renderResult.type) {
                case 'html':
                    res.setHeader('content-type', 'text/html; charset=utf-8');
                    res.setHeader('cache-control', 'max-age=0');
                    res.write(renderResult.data);
                    break;
                case 'json':
                    res.setHeader(
                        'content-type',
                        'application/json; charset=utf-8'
                    );
                    res.write(JSON.stringify(renderResult.data));
                    break;
            }
            res.end();
        } catch (err) {
            next(err);
        }
    }

    private _createContext(
        ssr: Genesis.SSR,
        context: Partial<Genesis.RenderContext> = {}
    ): Genesis.RenderContext {
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
        if (!context.data?.id) {
            context.data.id = md5(`${context.data.name}-${context.data.url}`);
        }
        if (!context.compile) {
            context.compile = this.compile;
        }
        if (!context.format) {
            context.format = new ssr.Format(this.ssr);
        }
        context.ssr = this.ssr;
        return context as any;
    }

    private _mergeContextData(
        context: Genesis.RenderContext,
        data: Genesis.RenderData
    ): Genesis.RenderData {
        const { format } = context;
        context.data.style = format.style(data);
        context.data.html = format.html(data);
        context.data.scriptState = format.scriptState(data);
        context.data.script = format.script(data);

        return context.data;
    }

    private async _renderJson(
        context: Genesis.RenderContext
    ): Promise<Genesis.RenderResultJson> {
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
    private async _renderHtml(
        context: Genesis.RenderContext
    ): Promise<Genesis.RenderResultHtml> {
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
    public get staticPublicPath() {
        return this.ssr.publicPath;
    }

    /**
     * Static file directory
     */
    public get staticDir() {
        return this.ssr.staticDir;
    }

    /**
     * The server renders a JSON
     */
    private async _ssrToJson(
        context: Genesis.RenderContext
    ): Promise<Genesis.RenderData> {
        const data: Genesis.RenderData = (await this.ssrRenderer.renderToString(
            context
        )) as any;
        this._mergeContextData(context, data);
        await this.ssr.plugin.callHook('renderCompleted', context);
        return context.data;
    }

    /**
     * The server renders a HTML
     */
    private async _ssrToString(
        context: Genesis.RenderContext
    ): Promise<string> {
        await this._ssrToJson(context);
        return context.compile(context.data);
    }

    /**
     * The client renders a JSON
     */
    private async _csrToJson(
        context: Genesis.RenderContext
    ): Promise<Genesis.RenderData> {
        const vm = new Vue({
            render(h) {
                return h('div');
            }
        });
        const data: Genesis.RenderData = (await this.csrRenderer.renderToString(
            vm,
            context
        )) as any;
        data.html = `<div data-ssr-genesis-id="${data.id}" data-server-rendered="false"></div>`;
        this._mergeContextData(context, data);
        await this.ssr.plugin.callHook('renderCompleted', context);
        return context.data;
    }

    /**
     * The client renders a HTML
     */
    private async _csrToString(
        context: Genesis.RenderContext
    ): Promise<string> {
        await this._csrToJson(context);
        return context.compile(context.data);
    }
}
