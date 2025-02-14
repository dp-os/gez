import path from 'node:path';
import serialize from 'serialize-javascript';
import type { Gez, ImportMap } from './gez';
import { pathWithoutIndex } from './path-without-index';

export type ImportmapMode = 'inline' | 'js';

export interface RenderContextOptions {
    base?: string;
    entryName?: string;
    params?: Record<string, any>;
    importmapMode?: ImportmapMode;
}

export class RenderContext {
    public static IMPORTMAP_CREATE_SCRIPT_CODE = `
(() => {
const i = window.__importmap__;
if (!i) {
    return;
}
if (i.imports) {
    ${pathWithoutIndex.name}(i.imports);
}
const s = document.createElement("script");
s.type = 'importmap';
s.innerText = JSON.stringify(i);
document.head.appendChild(s);
${pathWithoutIndex}
})();
`.trim();
    public gez: Gez;
    public redirect: string | null = null;
    public status: number | null = null;
    private _html = '';
    public readonly base: string;
    public readonly params: Record<string, any>;
    public readonly entryName: string;
    public importMetaSet = new Set<ImportMeta>();
    public files: RenderFiles = {
        js: [],
        css: [],
        modulepreload: [],
        importmap: [],
        resources: []
    };
    private _importMap: ImportMap | null = null;
    public importmapMode: RenderContextOptions['importmapMode'] = 'js';
    public constructor(gez: Gez, options: RenderContextOptions = {}) {
        this.gez = gez;
        this.base = options.base ?? '';
        this.params = options.params ?? {};
        this.entryName = options.entryName ?? 'default';
        this.importmapMode = options.importmapMode ?? 'inline';
    }
    public get html() {
        return this._html;
    }
    public set html(html) {
        const varName = this.gez.basePathPlaceholder;
        this._html = varName
            ? html.replaceAll(this.gez.basePathPlaceholder, this.base)
            : html;
    }
    public serialize(input: any, options?: serialize.SerializeJSOptions) {
        return serialize(input, options);
    }
    public state(varName: string, data: Record<string, any>): string {
        return `<script>window[${serialize(varName)}] = JSON.parse(${serialize(JSON.stringify(data))});</script>`;
    }
    public async commit() {
        const { gez } = this;
        const chunkSet = new Set([`${gez.name}@src/entry.client.ts`]);
        for (const item of this.importMetaSet) {
            if ('chunkName' in item && typeof item.chunkName === 'string') {
                chunkSet.add(item.chunkName);
            }
        }

        const files: {
            [K in keyof RenderFiles]: Set<string>;
        } = {
            js: new Set(),
            modulepreload: new Set(),
            importmap: new Set(),
            css: new Set(),
            resources: new Set()
        };

        const getUrlPath = (...paths: string[]) =>
            path.posix.join('/', this.base, ...paths);

        const manifests = await this.gez.getManifestList('client');
        manifests.forEach((item) => {
            const addPath = (setName: keyof RenderFiles, filepath: string) =>
                files[setName].add(getUrlPath(item.name, filepath));
            const addPaths = (
                setName: keyof RenderFiles,
                filepaths: string[]
            ) => filepaths.forEach((filepath) => addPath(setName, filepath));
            addPath('importmap', item.importmapJs);
            Object.entries(item.chunks).forEach(([filepath, info]) => {
                if (chunkSet.has(filepath)) {
                    addPath('js', info.js);
                    addPaths('css', info.css);
                    addPaths('resources', info.resources);
                }
            });
        });

        const preloadPaths = await gez.getImportPreloadPaths(
            gez.name + '/src/entry.client'
        );
        preloadPaths?.forEach((filepath) =>
            files.modulepreload.add(getUrlPath(filepath))
        );

        files.js = new Set([
            ...files.js,
            ...files.modulepreload,
            ...files.importmap
        ]);
        Object.keys(files).forEach(
            (key) => (this.files[key] = Array.from(files[key]))
        );

        this._importMap =
            this.importmapMode === 'inline'
                ? await gez.getImportMap('client', false)
                : null;
    }
    public preload() {
        const css = this.files.css
            .map((url) => {
                return `<link rel="preload" href="${url}" as="style">`;
            })
            .join('');
        const js = this.files.importmap
            .map((url) => {
                return `<link rel="preload" href="${url}" as="script">`;
            })
            .join('');
        return css + js;
    }
    public css() {
        return this.files.css
            .map((url) => `<link rel="stylesheet" href="${url}">`)
            .join('');
    }
    public importmap() {
        if (this._importMap) {
            return `<script>window.__importmap__ = ${this.serialize(
                this._importMap
            )};${RenderContext.IMPORTMAP_CREATE_SCRIPT_CODE}</script>`;
        }
        return `${this.files.importmap
            .map((url) => `<script src="${url}"></script>`)
            .join(
                ''
            )}<script>${RenderContext.IMPORTMAP_CREATE_SCRIPT_CODE}</script>`;
    }
    public moduleEntry() {
        return `<script type="module">import "${this.gez.name}/src/entry.client";</script>`;
    }
    public modulePreload() {
        return this.files.modulepreload
            .map((url) => `<link rel="modulepreload" href="${url}">`)
            .join('');
    }
}

export type ServerRenderHandle = (render: RenderContext) => Promise<void>;

export interface RenderFiles {
    css: string[];
    modulepreload: string[];
    importmap: string[];
    js: string[];
    resources: string[];
}
