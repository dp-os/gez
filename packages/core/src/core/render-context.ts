import fs from 'node:fs/promises';
import path from 'node:path';
import serialize from 'serialize-javascript';
import type { Gez, PackageJson } from './gez';

/**
 * 渲染的参数
 */
export interface RenderContextOptions {
    /**
     * 静态资产的 base 地址，默认为空
     */
    base?: string;
    /**
     * 自定义请求的参数
     */
    params?: Record<string, any>;
}

/**
 * 渲染上下文
 */
export class RenderContext {
    /**
     * 设置重定向的地址
     */
    public redirect: string | null = null;
    /**
     * 设置状态码
     */
    public status: number | null = null;
    public gez: Gez;
    private _html = '';
    /**
     * 静态资源的基本地址
     */
    public readonly base: string;
    /**
     * 请求的参数
     */
    public readonly params: Record<string, any>;
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
    }
    public get html() {
        return this._html;
    }
    public set html(html) {
        const varName = this.gez.dynamicBaseVar;
        this._html = varName
            ? html.replaceAll(this.gez.dynamicBaseVar, this.base)
            : html;
    }
    /**
     * 透传 https://github.com/yahoo/serialize-javascript
     */
    public serialize(input: any, options?: serialize.SerializeJSOptions) {
        return serialize(input, options);
    }
    public state(varName: string, data: Record<string, any>): string {
        return `<script>window[${serialize(varName)}] = JSON.parse(${serialize(JSON.stringify(data))});</script>`;
    }
    /**
     * 获取全部的远程包信息
     */
    public async getPackagesJson(): Promise<PackageJson[]> {
        return Promise.all(
            this.gez.moduleConfig.imports.map(async (item) => {
                const file = path.resolve(
                    item.localPath,
                    'client/package.json'
                );
                const result = await fs.readFile(file, 'utf-8');
                const json = JSON.parse(result) as PackageJson;
                json.name = item.name;
                return json;
            })
        );
    }
    public async bind(importsMeta: ImportMeta[]) {
        const packages = await this.getPackagesJson();
        const fromSet = new Set<string>();
        importsMeta.forEach((item) => {
            if ('buildFrom' in item && Array.isArray(item.buildFrom)) {
                item.buildFrom.forEach((item) => fromSet.add(item));
            }
        });
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

        packages.forEach((item) => {
            const base = `${this.base}/${item.name}/`;
            files.importmap.push(`${base}importmap.${item.hash}.js`);
            Object.entries(item.build).forEach(([filepath, info]) => {
                if (fromSet.has(filepath)) {
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
        return (
            this.files.importmap
                .map((url) => `<script src="${url}"></script>`)
                .join('') +
            `<script>if (window.__importmap__) {const s = document.createElement('script');s.type = 'importmap';s.innerText = JSON.stringify(window.__importmap__);document.body.appendChild(s);}</script>`
        );
    }
    public modulePreload() {
        return this.files.modulepreload
            .map((url) => `<link rel="modulepreload" href="${url}">`)
            .join('');
    }
    public moduleEntry() {
        return `<script type="module">import "${this.gez.name}/entry";</script>`;
    }
}

/**
 * 服务渲染的处理函数
 */
export type ServerRenderHandle = (render: RenderContext) => Promise<void>;

/**
 * 当前页面渲染的文件
 */
export interface RenderFiles {
    js: string[];
    css: string[];
    modulepreload: string[];
    importmap: string[];
    resources: string[];
}
