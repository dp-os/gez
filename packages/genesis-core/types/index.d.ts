/// <reference types="node" />
import Config from 'webpack-chain';
import Ejs from 'ejs';
import { ServerResponse, IncomingMessage } from 'http';
import { SSR as SSRConstructor } from './ssr';
import { Plugin as PluginConstructor, PluginManage as PluginManageConstructor } from './plugin';
import { Renderer as RendererConstructor } from './renderer';
import { Format as FormatConstructor } from './format';
declare namespace Genesis {
    /**
     * SSR Constructor
     */
    const SSR: typeof SSRConstructor;
    type SSR = SSRConstructor;
    /**
     * Renderer Constructor
     */
    const Renderer: typeof RendererConstructor;
    type Renderer = RendererConstructor;
    /**
     * SSR plug-in
     */
    const Plugin: typeof PluginConstructor;
    type Plugin = PluginConstructor;
    /**
     * Plug in Management Center
     */
    const PluginManage: typeof PluginManageConstructor;
    type PluginManage = PluginManageConstructor;
    /**
     * Render template
     */
    const Format: typeof FormatConstructor;
    type Format = FormatConstructor;
    /**
     * Webpack construction objectives
     */
    type WebpackBuildTarget = 'client' | 'server';
    /**
     * Build options
     */
    interface BuildOptions {
        /**
         * Basic folder for the project
         */
        baseDir?: string;
        /**
         * Basic directory for compiling output
         */
        outputDir?: string;
        /**
         * Which compiled directories are included
         */
        transpile?: RegExp[];
        /**
         * alias settings
         */
        alias?: {
            [x: string]: string;
        };
        /**
         * Configure build objectives, See https://github.com/browserslist/browserslist for details
         */
        browsers?: Browsers;
        /**
         * Template file path
         */
        template?: string;
    }
    interface Browsers {
        client?: Browserslist;
        server?: Browserslist;
    }
    type Browserslist = string | string[];
    interface Options {
        /**
         * The name of the application. The default is ssr-genesis
         */
        name?: string;
        /**
         * Build side configuration
         */
        build?: BuildOptions;
    }
    /**
     * Hook parameter of webpack
     */
    interface WebpackHookParams {
        target: 'client' | 'server';
        config: Config;
    }
    /**
     * Render Type
     */
    type RenderType = 'json' | 'html' | 'reject';
    /**
     * Render Mode
     */
    type RenderModeJson = 'csr-json' | 'ssr-json';
    type RenderModeHtml = 'csr-html' | 'ssr-html';
    type RenderMode = RenderModeJson | RenderModeHtml;
    /**
     * Render result
     */
    type RenderResul = RenderResultHtml | RenderResultJson;
    /**
     * Rendered HTML
     */
    interface RenderResultHtml {
        type: 'html';
        data: string;
        context: RenderContext;
    }
    /**
     * Rendered JSON
     */
    interface RenderResultJson {
        type: 'json';
        data: RenderData;
        context: RenderContext;
    }
    /**
     * Rendered data
     */
    interface RenderData {
        url: string;
        id: string;
        html: string;
        name: string;
        state: {
            [x: string]: any;
        };
        style: string;
        script: string;
        scriptState: string;
        resource: RenderContextResource[];
        [x: string]: any;
    }
    interface ClientOptions {
        url: string;
        id: string;
        name: string;
        state: {
            [x: string]: any;
        };
        el: Element;
    }
    interface RenderOptions<T = RenderMode> {
        req?: IncomingMessage;
        res?: ServerResponse;
        mode?: T;
        url?: string;
        id?: string;
        name?: string;
        state?: {
            [x: string]: any;
        };
    }
    /**
     * Rendered context
     */
    interface RenderContext {
        data: RenderData;
        mode: RenderMode;
        ssr: SSR;
        req?: IncomingMessage;
        res?: ServerResponse;
        compile: Ejs.TemplateFunction;
        format: Format;
    }
    interface RenderContextResource {
        file: string;
        extension: string;
    }
    /**
     * Preload resources
     */
    interface RenderContextPreload extends RenderContextResource {
        fileWithoutQuery: string;
        asType: string;
    }
    /**
     * Options for rendering
     */
    interface RendererOptions {
        client: {
            data: any;
            fs: any;
        };
        server: {
            data: any;
            fs: any;
        };
    }
    type CompilerType = 'build' | 'watch';
}
export = Genesis;
