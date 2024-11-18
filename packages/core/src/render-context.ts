import serialize from 'serialize-javascript';
import type { Gez } from './gez';

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
}

/**
 * 渲染上下文
 */
export class RenderContext {
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
    public constructor(gez: Gez, options: RenderContextOptions = {}) {
        this.gez = gez;
        this.base = options.base ?? '';
        this.params = options.params ?? {};
        this.entryName = options.entryName ?? 'default';
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
        const files: RenderFiles = {
            js: [],
            modulepreload: [],
            importmap: [],
            css: [],
            resources: []
        };

        const fileSet = new Set<string>();
        const appendFile = (file: string, cb: () => void) => {
            if (fileSet.has(file)) {
                return;
            }
            fileSet.add(file);
            cb();
        };

        this.gez.getManifestList('client').forEach((item) => {
            const base = `${this.base}/${item.name}/`;
            files.importmap.push(`${base}importmap.${item.hash}.final.js`);
            Object.entries(item.chunks).forEach(([filepath, info]) => {
                if (chunkSet.has(filepath)) {
                    appendFile(info.js, () => {
                        files.modulepreload.push(`${base}${info.js}`);
                    });
                    info.css.forEach((css) => {
                        appendFile(css, () => {
                            files.css.push(`${base}${css}`);
                        });
                    });
                    info.resources.forEach((resource) => {
                        appendFile(resource, () => {
                            files.resources.push(`${base}${resource}`);
                        });
                    });
                }
            });
        });
        files.js.push(...files.importmap, ...files.modulepreload);
        this.files = files;
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
        return (
            this.files.importmap
                .map((url) => `<script src="${url}"></script>`)
                .join('') +
            `<script>(() => {const s = document.createElement("script");s.type = "importmap";s.innerText = JSON.stringify(window.__importmap__ ?? {});document.body.appendChild(s);})();</script>`
        );
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
