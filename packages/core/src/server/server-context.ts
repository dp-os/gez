import type { Gez } from '../core';
import type { AppRenderParams } from '../core/app';
import { readJson } from './read-json';

export type ManifestJson = Record<
    string,
    {
        base: string;
        file: string;
        src: string;
        isDynamicEntry?: boolean;
        css: string[];
        imports?: string[];
        isEntry?: boolean;
    }
>;

export type ServerRender = (context: ServerContext) => Promise<void>;

export class ServerContext {
    public html = '';

    public redirect: string | null = null;
    public status: number | null = null;
    public extra: Record<string, any> = {};

    public readonly params: AppRenderParams;

    public modules = new Set<string>();
    public manifest: ManifestJson = {};
    public gez: Gez;
    public constructor(gez: Gez, params: AppRenderParams) {
        this.gez = gez;
        this.params = params;
        if (params.extra) {
            this.extra = params.extra;
        }

        this._loadManifestJson();
        this._initModules();
    }

    public insertHtml(
        html: string,
        position: 'headBefore' | 'bodyBefore'
    ): this {
        switch (position) {
            case 'headBefore':
                this._insertHtmlAtHeadBefore(html);
                break;
            case 'bodyBefore':
                this._insertHtmlAtBodyBefore(html);
                break;
        }
        return this;
    }

    private _insertHtmlAtHeadBefore(insertHtml: string) {
        const { html } = this;
        const index = html.indexOf('</head>');
        if (index > -1) {
            const start = html.substring(0, index);
            const end = html.substring(index);
            this.html = start + insertHtml + end;
        } else {
            this.html = insertHtml + html;
        }
        return this;
    }

    private _insertHtmlAtBodyBefore(insertHtml: string) {
        const { html } = this;
        const index = html.indexOf('</body>');
        if (index > -1) {
            const start = html.substring(0, index);
            const end = html.substring(index);
            this.html = start + insertHtml + end;
        } else {
            this.html = insertHtml + html;
        }
    }

    private _loadManifestJson() {
        const { gez } = this;
        const manifest = readJson<ManifestJson>(
            gez.getProjectPath('dist/client/manifest.json'),
            {}
        );
        const { base } = gez;
        Object.values(manifest).forEach((item) => {
            item.file = base + item.file;
            item.css = (item.css || []).map((file) => base + file);
        });
        Object.assign(this.manifest, manifest);
    }

    private _initModules() {
        const { modules } = this;
        Object.values(this.manifest).forEach((item) => {
            if (item.isEntry && item.src) {
                modules.add(item.src);
            }
        });
    }

    public getPreloadCssFiles() {
        const { modules, manifest } = this;
        const set = new Set<string>();
        modules.forEach((value) => {
            const item = manifest[value];
            if (!item) return;
            if (Array.isArray(item.css)) {
                item.css.forEach((file) => {
                    set.add(file);
                });
            }
        });
        return Array.from(set);
    }

    public getPreloadJsFiles() {
        const { modules, manifest } = this;
        const set = new Set<string>();
        modules.forEach((value) => {
            const item = manifest[value];
            if (!item) return;
            set.add(item.file);
        });
        return Array.from(set);
    }
}
