import * as Genesis from './';
import { Renderer } from './renderer';
export declare class SSR {
    /**
     * Renderer
     */
    Renderer: typeof Renderer;
    /**
     * Constructor options
     */
    options: Genesis.Options;
    /**
     * Plug in management
     */
    plugin: Genesis.PluginManage;
    /**
     * Constructor
     */
    constructor(options?: Genesis.Options);
    /**
     * Judge whether it is a production environment. By default, judge by process.env.NODE_ENV
     */
    get isProd(): boolean;
    /**
     * Current app name, default is 'ssr-genesis'
     */
    get name(): string;
    /**
     * The basic path of client static resource loading, which is '/ssr-genesis/' by default
     */
    get publicPath(): string;
    /**
     * CDN resource public path, Only valid in production mode
     */
    get cdnPublicPath(): string;
    /**
     * Project root
     */
    get baseDir(): string;
    /**
     * Compiled output directory
     */
    get outputDir(): string;
    /**
     * Client compile output directory
     */
    get outputDirInClient(): string;
    /**
     * Server compile output directory
     */
    get outputDirInServer(): string;
    /**
     * Static file directory
     */
    get staticDir(): string;
    /**
     * Compile source entry directory
     */
    get srcDir(): string;
    /**
     * Directory to be compiled by webpack
     */
    get srcIncludes(): (string | RegExp)[];
    get transpile(): RegExp[];
    /**
     * Client side compile entry file
     */
    get entryClientFile(): string;
    /**
     * Server side compile entry file
     */
    get entryServerFile(): string;
    /**
     * Manifest file path of client
     */
    get outputClientManifestFile(): string;
    /**
     * Manifest file path of server
     */
    get outputServerBundleFile(): string;
    /**
     * Template path
     */
    get templateFile(): string;
    /**
     * Template output path
     */
    get outputTemplateFile(): string;
    /**
     * Get the configuration of browsers
     */
    getBrowsers(env: keyof Genesis.Browsers): string | string[];
    /**
     * Create a renderer
     */
    createRenderer(options?: Genesis.RendererOptions): Renderer;
}
