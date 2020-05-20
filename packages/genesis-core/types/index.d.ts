/// <reference types="node" />
import Config from 'webpack-chain';
import Vue from 'vue';
import { ServerResponse, IncomingMessage } from 'http';
import { SSR as SSRConstructor } from './ssr';
import { Plugin as PluginConstructor, PluginManage as PluginManageConstructor } from './plugin';
import { Renderer as RendererConstructor } from './renderer';
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
        /**
         * Static resource public path
         */
        publicPath?: string;
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
        /**
         * Production environment or not
         */
        isProd?: boolean;
        /**
         * CDN resource public path, Only valid in production mode
         */
        cdnPublicPath?: string;
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
    type RenderType = 'json' | 'html';
    /**
     * Render Mode
     */
    type RenderModeJson = 'csr-json' | 'ssr-json';
    type RenderModeHtml = 'csr-html' | 'ssr-html';
    type RenderMode = RenderModeJson | RenderModeHtml;
    /**
     * Render result
     */
    type RenderResult<T extends RenderMode = RenderMode> = T extends Genesis.RenderModeHtml ? Genesis.RenderResultHtml : Genesis.RenderResultJson;
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
        automount: boolean;
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
    interface RenderOptions<T extends Genesis.RenderMode = Genesis.RenderMode> {
        req?: IncomingMessage;
        res?: ServerResponse;
        mode?: T;
        url?: string;
        id?: string;
        name?: string;
        automount?: boolean;
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
        renderHtml: () => string;
        beforeRender: (cb: (context: RenderContext) => void) => void;
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
    interface ClientManifest {
        publicPath: string;
        all: string[];
        initial: string[];
        async: string[];
        modules: {
            [key: string]: number[];
        };
    }
    /**
     * Options for rendering
     */
    interface RendererOptions {
        client: {
            data: ClientManifest;
            fs: any;
        };
        server: {
            data: {
                entry: string;
                files: {
                    [x: string]: string;
                };
                maps: {
                    [key: string]: RendererOptionsMap;
                };
            };
            fs: any;
        };
    }
    interface RendererOptionsMap {
        version: number;
        sources: string[];
        names: string[];
        mappings: string;
        file: string;
        sourcesContent: string[];
        sourceRoot: string;
    }
    type CompilerType = 'build' | 'watch';
}
export = Genesis;
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        renderContext?: Genesis.RenderContext;
        clientOptions?: Genesis.ClientOptions;
    }
}
