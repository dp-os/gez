import path from 'node:path';
import serialize from 'serialize-javascript';
import type { Gez, ImportMap } from './gez';
import { pathWithoutIndex } from './path-without-index';

/**
 * 导入映射的模式
 *
 * @description
 * 定义了导入映射在 HTML 中的处理方式：
 * - inline：导入映射会被直接嵌入到 HTML 输出中（默认）
 * - js：导入映射会被放置在一个外部 JS 文件中，适合对象较大的情况，可以利用缓存复用
 *
 * @example
 * ```typescript
 * // 使用内联模式
 * const context = await app.render({
 *   importmapMode: 'inline'
 * });
 *
 * // 使用外部 JS 文件模式
 * const context = await app.render({
 *   importmapMode: 'js'
 * });
 * ```
 */
export type ImportmapMode = 'inline' | 'js';

/**
 * 渲染上下文的配置选项
 *
 * @description
 * 定义了渲染上下文的配置参数，包括基础路径、入口名称、参数和导入映射模式等。
 *
 * @example
 * ```typescript
 * // 创建一个带有自定义配置的渲染上下文
 * const context = await app.render({
 *   base: '/my-app/',
 *   entryName: 'main',
 *   params: { theme: 'dark' },
 *   importmapMode: 'inline'
 * });
 * ```
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
 * 服务端渲染的上下文类
 *
 * @description
 * RenderContext 类是服务端渲染的核心，负责管理渲染过程中的状态、依赖收集和资源注入。
 * 它提供了一系列方法来处理：
 * - HTML 内容的生成和管理
 * - CSS 和 JavaScript 资源的预加载
 * - 模块依赖的收集和注入
 * - 导入映射的处理
 * - 状态序列化
 *
 * 资源加载顺序说明：
 * 1. preload() 和 css() 必须在 head 中：
 *    - preload() 越早执行，浏览器就能越早开始加载资源
 *    - css() 必须在 head 中以避免页面闪烁（FOUC）
 *
 * 2. importmap() 必须在 body 中且在 moduleEntry() 之前：
 *    - importmap 定义了 ESM 模块的路径映射规则
 *    - 客户端入口模块和其依赖都需要使用这些映射来正确加载
 *
 * 3. moduleEntry() 必须在 importmap() 之后：
 *    - 确保在执行模块代码前已经正确设置了导入映射
 *    - 避免模块加载失败或路径解析错误
 *
 * 4. modulePreload() 必须在 importmap() 和 moduleEntry() 之后：
 *    - modulePreload 会预加载模块的依赖，需要正确的路径解析
 *    - 如果在 importmap 之前执行，预加载请求可能使用错误的路径
 *
 * @example
 * ```typescript
 * // Vue 应用的服务端渲染示例
 * import { createSSRApp } from 'vue';
 * import { renderToString } from '@vue/server-renderer';
 *
 * export default async (context: RenderContext) => {
 *   // 创建 Vue 应用实例
 *   const app = createSSRApp(App, {
 *     // 传入服务端的初始状态
 *     initialState: context.params
 *   });
 *
 *   // 渲染应用到 HTML 字符串
 *   const appHtml = await renderToString(app);
 *
 *   // 提交依赖收集
 *   await context.commit();
 *
 *   // 注入初始状态
 *   const stateScript = context.state('__INITIAL_STATE__', context.params);
 *
 *   // 生成完整的 HTML，注意资源注入的顺序
 *   context.html = `
 *     <!DOCTYPE html>
 *     <html>
 *       <head>
 *         ${context.preload()}  <!-- 预加载 CSS 和 JS -->
 *         ${context.css()}      <!-- 注入首屏样式 -->
 *         <title>Vue SSR App</title>
 *       </head>
 *       <body>
 *         <div id="app">${appHtml}</div>
 *         ${stateScript}         <!-- 注入服务端状态 -->
 *         ${context.importmap()} <!-- 注入模块导入映射 -->
 *         ${context.moduleEntry()}  <!-- 注入客户端入口 -->
 *         ${context.modulePreload()}  <!-- 预加载模块依赖 -->
 *       </body>
 *     </html>
 *   `;
 * };
 * ```
 */
export class RenderContext {
    /**
     * 导入映射创建的脚本代码
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
     * 响应的 html 内容
     *
     * @description
     * 获取或设置渲染的 HTML 内容。当设置 HTML 内容时，会自动处理基础路径占位符的替换。
     *
     * @example
     * ```typescript
     * // 设置 HTML 内容
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <head>${context.preload()}${context.css()}</head>
     *     <body>
     *       <div id="app">${appContent}</div>
     *       ${context.importmap()}
     *       ${context.moduleEntry()}
     *     </body>
     *   </html>
     * `;
     *
     * // 获取处理后的 HTML
     * console.log(context.html);
     * ```
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
     * 序列化 JavaScript 数据
     *
     * @description
     * 使用 serialize-javascript 库序列化数据，确保数据可以安全地嵌入到 HTML 中。
     * 支持处理正则表达式、函数、Date 等特殊类型。
     *
     * @param input - 需要序列化的数据
     * @param options - serialize-javascript 的配置选项
     * @returns 序列化后的字符串
     *
     * @example
     * ```typescript
     * // 序列化复杂数据结构
     * const data = {
     *   date: new Date(),
     *   regex: /pattern/,
     *   fn: function() {}
     * };
     * const serialized = context.serialize(data);
     * ```
     */
    public serialize(input: any, options?: serialize.SerializeJSOptions) {
        return serialize(input, options);
    }
    /**
     * 注入状态数据到 window 对象
     *
     * @description
     * 将数据序列化并注入到 window 对象中，通常用于在服务端渲染时传递初始状态到客户端。
     *
     * @param varName - 变量名称
     * @param data - 要注入的数据对象
     * @returns 生成的 script 标签字符串
     *
     * @example
     * ```typescript
     * // 注入初始状态
     * const initialState = { user: { id: 1, name: "张三" } };
     * const script = context.state("__INITIAL_STATE__", initialState);
     *
     * // 在 HTML 中使用
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <body>
     *       ${script}
     *     </body>
     *   </html>
     * `;
     * ```
     */
    public state(varName: string, data: Record<string, any>): string {
        return `<script>window[${serialize(varName)}] = JSON.parse(${serialize(JSON.stringify(data))});</script>`;
    }
    /**
     * 提交模块依赖并更新文件资源列表
     *
     * @description
     * 该方法负责：
     * - 收集并处理模块依赖关系
     * - 更新 CSS、JavaScript 和其他资源文件的列表
     * - 处理导入映射
     * - 准备客户端运行时所需的所有资源
     *
     * 通常在服务端渲染完成后调用，以确保所有必要的资源都被正确收集和处理。
     *
     * @example
     * ```typescript
     * // 渲染应用并收集依赖
     * const app = createApp();
     * const html = await renderToString(app);
     *
     * // 提交依赖收集
     * await context.commit();
     *
     * // 生成完整的 HTML，包含所有必要的资源引用
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <head>
     *       ${context.preload()}
     *       ${context.css()}
     *     </head>
     *     <body>
     *       <div id="app">${html}</div>
     *       ${context.importmap()}
     *       ${context.moduleEntry()}
     *     </body>
     *   </html>
     * `;
     * ```
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
     * 生成 JS 和 CSS 文件的预加载代码
     *
     * @description
     * 该方法根据收集的文件资源生成预加载标签，包括：
     * - CSS 文件的预加载标签
     * - JS 文件的预加载标签
     *
     * 预加载可以提前告知浏览器即将需要的资源，优化加载性能。
     *
     * @returns 返回预加载标签的 HTML 字符串
     *
     * @example
     * ```typescript
     * // 在 HTML head 中添加预加载标签
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <head>
     *       ${context.preload()}
     *       ${context.css()}
     *     </head>
     *     <body>...</body>
     *   </html>
     * `;
     * ```
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
     * 生成服务端首屏加载的 CSS 标签
     *
     * @description
     * 该方法根据收集的 CSS 文件生成样式表链接标签。
     * 这些样式表对于首屏渲染至关重要，应该放在 HTML 的 head 部分。
     *
     * @returns 返回 CSS 链接标签的 HTML 字符串
     *
     * @example
     * ```typescript
     * // 在 HTML head 中添加样式表
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <head>
     *       ${context.css()}
     *     </head>
     *     <body>...</body>
     *   </html>
     * `;
     * ```
     */
    public css() {
        return this.files.css
            .map((url) => `<link rel="stylesheet" href="${url}">`)
            .join('');
    }
    /**
     * 生成 importmap 相关代码
     *
     * @description
     * 该方法根据导入映射模式生成相应的代码：
     * - 当 importmapMode 为 'inline' 时，直接将导入映射内联到 HTML 中
     * - 当 importmapMode 为 'js' 时，通过外部 JS 文件加载导入映射
     *
     * 导入映射用于控制模块的导入路径解析，是 ESM 模块系统的重要组成部分。
     * 必须在 moduleEntry() 之前执行，以确保模块能够正确解析依赖路径。
     *
     * @returns 返回导入映射相关的 HTML 代码字符串
     *
     * @example
     * ```typescript
     * // 在 HTML 中添加导入映射，注意顺序
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <head>
     *       ${context.preload()}
     *       ${context.css()}
     *     </head>
     *     <body>
     *       <div id="app">${appContent}</div>
     *       ${context.importmap()}    <!-- 先注入导入映射 -->
     *       ${context.moduleEntry()}  <!-- 再注入模块入口 -->
     *       ${context.modulePreload()}  <!-- 最后预加载模块 -->
     *     </body>
     *   </html>
     * `;
     * ```
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
     * 生成模块入口执行代码
     *
     * @description
     * 该方法生成客户端入口模块的导入语句。
     * 它会创建一个 type="module" 的 script 标签，用于加载和执行客户端的入口文件。
     * 必须在 importmap() 之后执行，以确保模块能够正确解析依赖路径。
     *
     * @returns 返回模块入口的 HTML script 标签字符串
     *
     * @example
     * ```typescript
     * // 在 HTML 中添加模块入口，注意顺序
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <head>
     *       ${context.preload()}
     *       ${context.css()}
     *     </head>
     *     <body>
     *       <div id="app">${appContent}</div>
     *       ${context.importmap()}    <!-- 先注入导入映射 -->
     *       ${context.moduleEntry()}  <!-- 再注入模块入口 -->
     *       ${context.modulePreload()}  <!-- 最后预加载模块 -->
     *     </body>
     *   </html>
     * `;
     * ```
     */
    public moduleEntry() {
        return `<script type="module">import "${this.gez.name}/src/entry.client";</script>`;
    }
    /**
     * 生成 ESM 模块预加载代码
     *
     * @description
     * 该方法生成 ESM 模块的预加载标签。
     * 使用 modulepreload 可以提前加载模块，优化首次执行时的性能。
     * 必须在 importmap() 和 moduleEntry() 之后执行，原因如下：
     * 1. 需要正确的模块路径解析规则（由 importmap 提供）
     * 2. 避免与入口模块的加载发生冲突
     * 3. 确保预加载的模块路径与实际执行时的路径一致
     *
     * @returns 返回模块预加载的 HTML 标签字符串
     *
     * @example
     * ```typescript
     * // 在 HTML 中添加模块预加载，注意顺序
     * context.html = `
     *   <!DOCTYPE html>
     *   <html>
     *     <head>
     *       ${context.preload()}
     *       ${context.css()}
     *     </head>
     *     <body>
     *       <div id="app">${appContent}</div>
     *       ${context.importmap()}    <!-- 先注入导入映射 -->
     *       ${context.moduleEntry()}  <!-- 再注入模块入口 -->
     *       ${context.modulePreload()}  <!-- 最后预加载模块 -->
     *     </body>
     *   </html>
     * `;
     * ```
     */
    public modulePreload() {
        return this.files.modulepreload
            .map((url) => `<link rel="modulepreload" href="${url}">`)
            .join('');
    }
}

/**
 * 服务端渲染处理函数
 *
 * @description
 * 定义了服务端渲染的处理函数类型，该函数接收一个渲染上下文对象，负责生成页面的 HTML 内容。
 *
 * @example
 * ```typescript
 * // 实现一个服务端渲染函数
 * const serverRender: ServerRenderHandle = async (context) => {
 *   const app = createApp();
 *   const html = await renderToString(app);
 *
 *   context.html = `
 *     <!DOCTYPE html>
 *     <html>
 *       <head>${context.preload()}${context.css()}</head>
 *       <body>
 *         <div id="app">${html}</div>
 *         ${context.importmap()}
 *         ${context.moduleEntry()}
 *       </body>
 *     </html>
 *   `;
 * };
 * ```
 */
export type ServerRenderHandle = (render: RenderContext) => Promise<void>;

/**
 * 渲染过程中收集的文件资源
 *
 * @description
 * 定义了页面渲染过程中收集的各类资源文件，包括：
 * - CSS 样式文件
 * - ESM 模块文件
 * - 导入映射文件
 * - JavaScript 文件
 * - 其他资源文件
 *
 * @example
 * ```typescript
 * // 渲染完成后查看收集的文件
 * await context.commit();
 * console.log('CSS 文件:', context.files.css);
 * console.log('JS 文件:', context.files.js);
 * console.log('预加载模块:', context.files.modulepreload);
 * ```
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
