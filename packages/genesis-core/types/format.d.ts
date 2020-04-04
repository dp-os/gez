import * as Genesis from '.';
import { SSR } from './ssr';
export declare class Format {
    ssr: SSR;
    constructor(ssr: SSR);
    /**
     * Rendering style, HTML, state, script
     */
    page(data: Genesis.RenderData): string;
    /**
     * Render HTML
     */
    html(data: Genesis.RenderData): string;
    /**
     * Render style
     */
    style(data: Genesis.RenderData): string;
    /**
     * Render script
     */
    script(data: Genesis.RenderData): string;
    /**
     * Render state
     */
    scriptState(data: Genesis.RenderData): string;
}
