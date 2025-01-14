import path from 'node:path';
import serialize from 'serialize-javascript';
import type { Gez, ImportMap } from './gez';
import { pathWithoutIndex } from './path-without-index';

/**
 * inline：导入映射会被直接嵌入到HTML输出中（默认）。
 * js：导入映射会被放置在一个外部 JS 文件中，适合对象较大的情况，可以利用缓存复用。
 */
export type ImportmapMode = 'inline' | 'js';
/**
 * 渲染的参数
 */
export interface RenderContextOptions {
    /**
     * 静态资产的公共路径，可以根据业务的上下文来动态设置不同的路径。
     */
    base?: string;
    /**
     * gez.render() 函数执行时，会调用 entry.server.ts 文件导出的名称。
     */
    entryName?: string;
    /**
     * 传递给 RenderContext 对象的 params 字段。
     */
    params?: Record<string, any>;
    /**
     * 导入映射使用的模式
     */
    importmapMode?: ImportmapMode;
}

/**
 * 渲染上下文
 */
export class RenderContext {
    /**
     * 导入映射创建的脚步代码
     */
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
    /**
     * Gez 的实例。
     */
    public gez: Gez;
    /**
     * 重定向地址。
     */
    public redirect: string | null = null;
    /**
     * 响应的状态码。
     */
    public status: number | null = null;
    private _html = '';
    /**
     * 参数传入的 base。
     */
    public readonly base: string;
    /**
     * 参数传入的 params。
     */
    public readonly params: Record<string, any>;
    /**
     * 参数传入的 entryName。
     */
    public readonly entryName: string;

    /**
     * 服务端渲染过程中，收集模块执行过程中的 import.meta 对象。
     */
    public importMetaSet = new Set<ImportMeta>();
    /**
     * importMetaSet 收集完成后，调用 rc.commit() 函数时，会更新这个对象的信息。
     */
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
    /**
     * 响应的 html 内容。
     */
    public get html() {
        return this._html;
    }
    public set html(html) {
        const varName = this.gez.basePathPlaceholder;
        this._html = varName
            ? html.replaceAll(this.gez.basePathPlaceholder, this.base)
            : html;
    }
    /**
     * 透传 https://github.com/yahoo/serialize-javascript
     */
    public serialize(input: any, options?: serialize.SerializeJSOptions) {
        return serialize(input, options);
    }
    /**
     * 在 window 对象，注入一个 JS 变量对象，data 必须是可以被序列化的。
     */
    public state(varName: string, data: Record<string, any>): string {
        return `<script>window[${serialize(varName)}] = JSON.parse(${serialize(JSON.stringify(data))});</script>`;
    }
    /**
     * 同构应用渲染完成后，提交模块依赖更新 files 对象。
     */
    public async commit() {
        const { gez } = this;
        const chunkSet = new Set([`${gez.name}@src/entry.client.ts`]);
        for (const item of this.importMetaSet) {
            if ('chunkName' in item && typeof item.chunkName === 'string') {
                chunkSet.add(item.chunkName);
            }
        }

        // 生成文件列表 直接用set去重
        const files: {
            [K in keyof RenderFiles]: Set<string>;
        } = {
            js: new Set(),
            modulepreload: new Set(),
            importmap: new Set(),
            css: new Set(),
            resources: new Set()
        };

        // 拼装出url风格的路径 闭包this.base
        const getUrlPath = (...paths: string[]) =>
            path.posix.join('/', this.base, ...paths);

        const manifests = await this.gez.getManifestList('client');
        manifests.forEach((item) => {
            // 添加文件路径 闭包item.name
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

        // 获取入口文件的静态 import 预加载信息
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
    /**
     * 根据 files 生成 JS 和 CSS 文件的预加载代码。
     */
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
    /**
     * 根据 files 生成服务端首屏加载的 CSS。
     */
    public css() {
        return this.files.css
            .map((url) => `<link rel="stylesheet" href="${url}">`)
            .join('');
    }
    /**
     * 根据 files 生成 importmap 相关代码。
     */
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
    /**
     * 根据 files 生成模块入口执行代码。
     */
    public moduleEntry() {
        return `<script type="module">import "${this.gez.name}/src/entry.client";</script>`;
    }
    /**
     * 根据 files 生成 ESM 模块预加载代码。
     */
    public modulePreload() {
        return this.files.modulepreload
            .map((url) => `<link rel="modulepreload" href="${url}">`)
            .join('');
    }
}

/**
 * 服务端渲染处理函数。
 */
export type ServerRenderHandle = (render: RenderContext) => Promise<void>;

/**
 * 当前页面渲染的文件
 */
export interface RenderFiles {
    /**
     * CSS 文件列表。
     */
    css: string[];
    /**
     * ESM 模块列表。
     */
    modulepreload: string[];
    /**
     * importmap.js 文件列表。
     */
    importmap: string[];
    /**
     * 全部的 JS 文件列表，包含 modulepreload 和 importmap。
     */
    js: string[];
    /**
     * 除了 JS 和 CSS 之外的其它文件列表。
     */
    resources: string[];
}
