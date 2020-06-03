import * as Genesis from './';
import { SSR } from './ssr';
export declare class Plugin {
    ssr: SSR;
    constructor(ssr: SSR);
    /**
     * Execute before building production environment
     */
    beforeCompiler(type: Genesis.CompilerType): void;
    /**
     * Add plug-in of webpack or change configuration of webpack
     */
    chainWebpack(config: Genesis.WebpackHookParams): void;
    /**
     * Modify the configuration of babel
     */
    babel(config: Genesis.BabelConfig): void;
    /**
     * Execute after building production environment
     */
    afterCompiler(type: Genesis.CompilerType): void;
    /**
     * Execute before rendering Middleware
     */
    renderBefore(context: Genesis.RenderContext): void;
    /**
     * SSR rendering complete execution
     */
    renderCompleted(context: Genesis.RenderContext): void;
}
export declare class PluginManage {
    /**
     * Current SSR instance
     */
    ssr: Genesis.SSR;
    /**
     * List of installed plug-ins
     */
    private plugins;
    constructor(ssr: Genesis.SSR);
    /**
     * Using a plug-in for SSR
     */
    use(P: typeof Plugin | Plugin): this;
    /**
     * Using a plug-in for SSR
     */
    unshift(P: typeof Plugin | Plugin): this;
    /**
     * Execute the hook of a plug-in asynchronously
     */
    callHook<T extends Exclude<keyof Plugin, 'ssr'>>(key: T, ...args: Parameters<Plugin[T]>): Promise<void>;
}
