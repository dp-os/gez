"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
class Format {
    constructor(ssr) {
        this.ssr = ssr;
    }
    /**
     * Rendering style, HTML, state, script
     */
    page(data) {
        return (this.style(data) +
            this.html(data) +
            this.scriptState(data) +
            this.script(data));
    }
    /**
     * Render HTML
     */
    html(data) {
        return data.html;
    }
    /**
     * Render style
     */
    style(data) {
        return data.style;
    }
    /**
     * Render script
     */
    script(data) {
        return data.script;
    }
    /**
     * Render state
     */
    scriptState(data) {
        const script = { ...data };
        const arr = ['style', 'html', 'scriptState', 'script', 'resource'];
        arr.forEach((k) => {
            Object.defineProperty(script, k, {
                enumerable: false
            });
        });
        const scriptJSON = serialize_javascript_1.default(script, {
            isJSON: true
        });
        return `<script data-ssr-genesis-name="${data.name}" data-ssr-genesis-id="${data.id}">window["${data.id}"]=${scriptJSON};</script>`;
    }
}
exports.Format = Format;
