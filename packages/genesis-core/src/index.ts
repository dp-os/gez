import Config from 'webpack-chain';
import Vue from 'vue';
import { ServerResponse, IncomingMessage } from 'http';
import { SSR as SSRConstructor } from './ssr';
import {
    Plugin as PluginConstructor,
    PluginManage as PluginManageConstructor
} from './plugin';
import { Renderer as RendererConstructor } from './renderer';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Genesis {
    /**
     * SSR Constructor
     */
    export const SSR = SSRConstructor;
    export type SSR = SSRConstructor;
    /**
     * Renderer Constructor
     */
    export const Renderer = RendererConstructor;
    export type Renderer = RendererConstructor;
    /**
     * SSR plug-in
     */
    export const Plugin = PluginConstructor;
    export type Plugin = PluginConstructor;
    /**
     * Plug in Management Center
     */
    export const PluginManage = PluginManageConstructor;
    export type PluginManage = PluginManageConstructor;
    /**
     * Webpack construction objectives
     */
    export type WebpackBuildTarget = 'client' | 'server';
    /**
     * Build options
     */
    export interface BuildOptions {
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
        transpile?: (RegExp | string)[];
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

    export interface Browsers {
        client?: Browserslist;
        server?: Browserslist;
    }

    export type Browserslist = string | string[];
    export interface Options {
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
    export interface WebpackHookParams {
        target: 'client' | 'server';
        config: Config;
    }
    export interface BabelConfig {
        target: 'client' | 'server';
        plugins: any[];
        presets: any[];
    }
    export interface PostcssOptions {
        target: 'client' | 'server';
        execute?: boolean;
        postcssOptions: {
            syntax?: string | object;
            parser?: string | Object | Function;
            plugins: any[];
        };
        sourceMap: boolean;
    }
    /**
     * Render Type
     */
    export type RenderType = 'json' | 'html';
    /**
     * Render Mode
     */
    export type RenderModeJson = 'csr-json' | 'ssr-json';
    export type RenderModeHtml = 'csr-html' | 'ssr-html';
    export type RenderMode = RenderModeJson | RenderModeHtml;
    /**
     * Render result
     */
    export type RenderResult<T extends RenderMode = RenderMode> =
        T extends Genesis.RenderModeHtml
            ? Genesis.RenderResultHtml
            : Genesis.RenderResultJson;
    /**
     * Rendered HTML
     */
    export interface RenderResultHtml {
        type: 'html';
        data: string;
        context: RenderContext;
    }
    /**
     * Rendered JSON
     */
    export interface RenderResultJson {
        type: 'json';
        data: RenderData;
        context: RenderContext;
    }
    /**
     * Rendered data
     */
    export interface RenderData {
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
    export interface ClientOptions {
        env: 'client';
        url: string;
        id: string;
        name: string;
        state: {
            [x: string]: any;
        };
        el: Element;
        mounted?: (app: Vue) => void;
    }
    export interface RenderOptions<
        T extends Genesis.RenderMode = Genesis.RenderMode
    > {
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
    export interface RenderContext {
        env: 'server';
        data: RenderData;
        mode: RenderMode;
        ssr: SSR;
        req?: IncomingMessage;
        res?: ServerResponse;
        renderHtml: () => string;
        beforeRender: (cb: (context: RenderContext) => void) => void;
    }

    export interface RenderContextResource {
        file: string;
        extension: string;
    }
    /**
     * Preload resources
     */
    export interface RenderContextPreload extends RenderContextResource {
        fileWithoutQuery: string;
        asType: string;
    }

    export interface ClientManifest {
        publicPath: string;
        all: string[];
        initial: string[];
        async: string[];
        modules: { [key: string]: number[] };
    }
    /**
     * Options for rendering
     */
    export interface RendererOptions {
        client: {
            data: ClientManifest;
            fs: any;
        };
        server: {
            data: {
                entry: string;
                files: { [x: string]: string };
                maps: { [key: string]: RendererOptionsMap };
            };
            fs: any;
        };
    }

    export interface RendererOptionsMap {
        version: number;
        sources: string[];
        names: string[];
        mappings: string;
        file: string;
        sourcesContent: string[];
        sourceRoot: string;
    }
    export type CompilerType = 'build' | 'watch';
}
// @ts-ignore
export = Genesis;

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        // @ts-ignore
        renderContext?: Genesis.RenderContext;
        // @ts-ignore
        clientOptions?: Genesis.ClientOptions;
    }
}
