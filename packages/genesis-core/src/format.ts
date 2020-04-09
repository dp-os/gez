import * as Genesis from '.';
import serialize from 'serialize-javascript';
import { SSR } from './ssr';

export class Format {
    public ssr: SSR;
    public constructor(ssr: SSR) {
        this.ssr = ssr;
    }

    /**
     * Rendering style, HTML, state, script
     */
    public page(data: Genesis.RenderData) {
        return (
            this.style(data) +
            this.html(data) +
            this.scriptState(data) +
            this.script(data)
        );
    }

    /**
     * Render HTML
     */
    public html(data: Genesis.RenderData) {
        return data.html;
    }
    /**
     * Render style
     */

    public style(data: Genesis.RenderData) {
        return data.style;
    }

    /**
     * Render script
     */
    public script(data: Genesis.RenderData) {
        return data.script;
    }

    /**
     * Render state
     */
    public scriptState(data: Genesis.RenderData) {
        const script = { ...data };
        const arr = ['style', 'html', 'scriptState', 'script', 'resource'];
        arr.forEach((k) => {
            Object.defineProperty(script, k, {
                enumerable: false
            });
        });
        const scriptJSON: string = serialize(script, {
            isJSON: true
        });
        return `<script data-ssr-genesis-name="${data.name}" data-ssr-genesis-id="${data.id}">window["${data.id}"]=${scriptJSON};</script>`;
    }
}
