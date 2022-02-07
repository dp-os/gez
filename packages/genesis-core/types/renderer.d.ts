/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import type * as Genesis from './';
export declare class Renderer {
    ssr: Genesis.SSR;
    clientManifest: Genesis.ClientManifest;
    private renderer;
    /**
     * Render template functions
     */
    private compile;
    private _createApp;
    constructor(ssr: Genesis.SSR);
    /**
     * Reload the renderer
     */
    reload(): void;
    /**
     * Render JSON
     */
    renderJson(options?: Genesis.RenderOptions<Genesis.RenderModeJson>): Promise<Genesis.RenderResultJson>;
    /**
     * Render HTML
     */
    renderHtml(options?: Genesis.RenderOptions<Genesis.RenderModeHtml>): Promise<Genesis.RenderResultHtml>;
    /**
     * General basic rendering function
     */
    render<T extends Genesis.RenderMode = Genesis.RenderMode>(options?: Genesis.RenderOptions<T>): Promise<Genesis.RenderResult<T>>;
    /**
     * Rendering Middleware
     */
    renderMiddleware(req: IncomingMessage, res: ServerResponse, next: (err: any) => void): Promise<void>;
    private _createContext;
    private _renderJson;
    /**
     * Render HTML
     */
    private _renderHtml;
    /**
     * Static file public path
     */
    get staticPublicPath(): string;
    /**
     * Static file directory
     */
    get staticDir(): string;
    /**
     * The server renders a JSON
     */
    private _ssrToJson;
    /**
     * The server renders a HTML
     */
    private _ssrToString;
    /**
     * The client renders a JSON
     */
    private _csrToJson;
    /**
     * The client renders a HTML
     */
    private _csrToString;
    private _styleTagExtractCSS;
}
export declare function styleTagExtractCSS(value: string): {
    cssRules: string;
    value: string;
};
