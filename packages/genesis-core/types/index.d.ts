/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import Vue from 'vue';
import Config from 'webpack-chain';
import { MF as MFConstructor } from './mf';
import { Plugin as PluginConstructor, PluginManage as PluginManageConstructor } from './plugin';
import { Renderer as RendererConstructor } from './renderer';
import { SSR as SSRConstructor } from './ssr';
declare namespace Genesis {
    /**
     * SSR Constructor
     */
    const SSR: typeof SSRConstructor;
    type SSR = SSRConstructor;
    const MF: typeof MFConstructor;
    type MF = MFConstructor;
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
    interface MFRemote {
        name: string;
        clientOrigin: string;
        serverOrigin: string;
    }
    interface MFOptions {
        /**
         * Relative path or absolute path from src directory
         */
        exposes?: Record<string, string>;
        /**
         * Remote service
         */
        remotes?: MFRemote[];
        /**
         * The polling interval of the server is 40ms by default
         */
        intervalTime?: number;
        /**
         * Shared configuration of webpack modulefederationplugin plug-in
         * https://webpack.docschina.org/plugins/module-federation-plugin/#Specify-package-versions
         */
        shared?: (string | SharedObject)[] | SharedObject;
    }
    interface SharedObject {
        [index: string]: string | SharedConfig;
    }
    interface SharedConfig {
        /**
         * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
         */
        eager?: boolean;
        /**
         * Provided module that should be provided to share scope. Also acts as fallback module if no shared module is found in share scope or version isn't valid. Defaults to the property name.
         */
        import?: string | false;
        /**
         * Package name to determine required version from description file. This is only needed when package name can't be automatically determined from request.
         */
        packageName?: string;
        /**
         * Version requirement from module in share scope.
         */
        requiredVersion?: string | false;
        /**
         * Module is looked up under this key from the share scope.
         */
        shareKey?: string;
        /**
         * Share scope name.
         */
        shareScope?: string;
        /**
         * Allow only a single version of the shared module in share scope (disabled by default).
         */
        singleton?: boolean;
        /**
         * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
         */
        strictVersion?: boolean;
        /**
         * Version of the provided module. Will replace lower matching versions, but not higher.
         */
        version?: string | false;
    }
    /**
     * Build options
     */
    interface BuildOptions {
        /**
         * Valid only in production environment
         */
        extractCSS?: boolean;
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
        /**
         * In the sandbox environment, inject global variables
         */
        sandboxGlobal?: Record<string, any>;
    }
    /**
     * Hook parameter of webpack
     */
    interface WebpackHookParams {
        target: 'client' | 'server';
        config: Config;
    }
    interface BabelConfig {
        target: 'client' | 'server';
        plugins: any[];
        presets: any[];
    }
    interface PostcssOptions {
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
    interface RenderOptions<T extends Genesis.RenderMode = Genesis.RenderMode> {
        req?: IncomingMessage;
        res?: ServerResponse;
        mode?: T;
        url?: string;
        id?: string;
        name?: string;
        automount?: boolean;
        /**
         * Extract tags from style files to CSS dynamically, Production environment enabled
         */
        styleTagExtractCSS?: boolean;
        state?: {
            [x: string]: any;
        };
    }
    /**
     * Rendered context
     */
    interface RenderContext {
        env: 'server';
        data: RenderData;
        mode: RenderMode;
        ssr: SSR;
        req?: IncomingMessage;
        res?: ServerResponse;
        styleTagExtractCSS: boolean;
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
