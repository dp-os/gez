/// <reference types="node" />
import { ServerResponse, IncomingMessage } from 'http';
import * as Genesis from './';
export declare class Renderer {
    ssr: Genesis.SSR;
    /**
     * Client side renderer
     */
    private csrRenderer;
    /**
     * Render template functions
     */
    private compile;
    /**
     * Server side renderer
     */
    private ssrRenderer;
    constructor(ssr: Genesis.SSR, options?: Genesis.RendererOptions);
    /**
     * Hot update
     */
    hotUpdate(options?: Genesis.RendererOptions): void;
    /**
     * Render JSON
     */
    renderJson(req: IncomingMessage, res: ServerResponse, mode?: Genesis.RenderModeJson): Promise<Genesis.RenderResultJson>;
    /**
     * Render HTML
     */
    renderHtml(req: IncomingMessage, res: ServerResponse, mode?: Genesis.RenderMode): Promise<Genesis.RenderResultHtml>;
    /**
     * General basic rendering function
     */
    render(req: IncomingMessage, res: ServerResponse, mode?: Genesis.RenderMode): Promise<Genesis.RenderResul>;
    /**
     * Rendering Middleware
     */
    renderMiddleware(req: IncomingMessage, res: ServerResponse, next: (err: any) => void): Promise<void>;
    private _createContext;
    private _mergeContextData;
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
}
