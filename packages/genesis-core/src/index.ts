import Config from 'webpack-chain';
import Ejs from 'ejs';
import { ServerResponse, IncomingMessage } from 'http';
import { SSR as SSRConstructor } from './ssr';
import {
    Plugin as PluginConstructor,
    PluginManage as PluginManageConstructor
} from './plugin';
import { Renderer as RendererConstructor } from './renderer';
import { Format as FormatConstructor } from './format';

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
     * Render template
     */
    export const Format = FormatConstructor;
    export type Format = FormatConstructor;
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
    }
    /**
     * Hook parameter of webpack
     */
    export interface WebpackHookParams {
        target: 'client' | 'server';
        config: Config;
    }
    /**
     * Render Type
     */
    export type RenderType = 'json' | 'html' | 'reject';
    /**
     * Render Mode
     */
    export type RenderModeJson = 'csr-json' | 'ssr-json';
    export type RenderModeHtml = 'csr-html' | 'ssr-html';
    export type RenderMode = RenderModeJson | RenderModeHtml;
    /**
     * Render result
     */
    export type RenderResul = RenderResultHtml | RenderResultJson;
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
        style: string;
        script: string;
        scriptState: string;
        resource: RenderContextResource[];
        name: string;
        state: {
            [x: string]: any;
        };
        [x: string]: any;
    }
    export interface ClientData {
        url: string;
        id: string;
        name: string;
        state: {
            [x: string]: any;
        };
        el: Element;
    }
    /**
     * Rendered context
     */
    export interface RenderContext {
        req?: IncomingMessage;
        res?: ServerResponse;
        data: RenderData;
        mode: RenderMode;
        ssr: SSR;
        compile: Ejs.TemplateFunction;
        format: Format;
        renderResourceHints(): string;
        renderStyles(): string;
        renderScripts(): string;
        getPreloadFiles(): RenderContextPreload[];
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
    /**
     * Options for rendering
     */
    export interface RendererOptions {
        client: { data: any; fs: any };
        server: { data: any; fs: any };
    }
    export type CompilerType = 'build' | 'watch';
}

export = Genesis;
