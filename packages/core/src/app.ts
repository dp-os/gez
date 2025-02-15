import { pathToFileURL } from 'node:url';
import { createLoaderImport } from '@gez/import';
import type { COMMAND, Gez } from './gez';
import { type Middleware, createMiddleware } from './middleware';
import {
    RenderContext,
    type RenderContextOptions,
    type ServerRenderHandle
} from './render-context';

/**
 * 应用程序实例接口。
 *
 * App 是 Gez 框架的应用抽象，提供了统一的接口来管理应用的生命周期、
 * 静态资源和服务端渲染。
 *
 * @example
 * ```typescript
 * // entry.node.ts
 * export default {
 *   // 开发环境配置
 *   async createDevApp(gez) {
 *     return import('@gez/rspack').then((m) =>
 *       m.createRspackHtmlApp(gez, {
 *         config(rc) {
 *           // 自定义 Rspack 配置
 *         }
 *       })
 *     );
 *   }
 * }
 * ```
 */
export interface App {
    /**
     * 静态资源处理中间件。
     *
     * 开发环境：
     * - 处理源码的静态资源请求
     * - 支持实时编译和热更新
     * - 使用 no-cache 缓存策略
     *
     * 生产环境：
     * - 处理构建后的静态资源
     * - 支持不可变文件的长期缓存（.final.xxx）
     * - 优化的资源加载策略
     *
     * @example
     * ```typescript
     * server.use(gez.middleware);
     * ```
     */
    middleware: Middleware;

    /**
     * 服务端渲染函数。
     *
     * 根据运行环境提供不同实现：
     * - 生产环境（start）：加载构建后的服务端入口文件（entry.server）执行渲染
     * - 开发环境（dev）：加载源码中的服务端入口文件执行渲染
     *
     * @param options - 渲染选项
     * @returns 返回渲染上下文，包含渲染结果
     *
     * @example
     * ```typescript
     * const rc = await gez.render({
     *   params: { url: '/page' }
     * });
     * res.end(rc.html);
     * ```
     */
    render: (options?: RenderContextOptions) => Promise<RenderContext>;

    /**
     * 生产环境构建函数。
     * 用于资源打包和优化。
     *
     * @returns 构建成功返回 true，失败返回 false
     */
    build?: () => Promise<boolean>;

    /**
     * 资源清理函数。
     * 用于关闭服务器、断开连接等。
     *
     * @returns 清理成功返回 true，失败返回 false
     */
    destroy?: () => Promise<boolean>;
}

/**
 * 创建生产环境的应用程序实例，开发环境不可用。
 */
export async function createApp(gez: Gez, command: COMMAND): Promise<App> {
    const render =
        command === gez.COMMAND.start
            ? await createStartRender(gez) // 提供实际的渲染函数
            : createErrorRender(gez); // 提供错误提示渲染函数
    return {
        middleware: createMiddleware(gez),
        render
    };
}

/**
 * 创建生产环境渲染函数。
 * 加载构建后的服务端入口文件（entry.server）执行渲染。
 *
 * @param gez - Gez 实例
 * @returns 返回渲染函数
 * @internal
 *
 * @example
 * ```typescript
 * // 服务端入口文件 (entry.server)
 * export default async function render(rc: RenderContext) {
 *   rc.html = '<html>...</html>';
 * }
 * ```
 */
async function createStartRender(gez: Gez) {
    const baseURL = pathToFileURL(gez.root) as URL;
    const importMap = await gez.getImportMap('server');
    const loaderImport = createLoaderImport(baseURL, importMap);

    return async (options?: RenderContextOptions): Promise<RenderContext> => {
        const rc = new RenderContext(gez, options);
        const result = await loaderImport(`${gez.name}/src/entry.server`);
        const serverRender: ServerRenderHandle = result[rc.entryName];
        if (typeof serverRender === 'function') {
            await serverRender(rc);
        }
        return rc;
    };
}

function createErrorRender(gez: Gez) {
    return (options?: RenderContextOptions) => {
        throw new Error(
            `App instance is only available in production and can only execute built artifacts.`
        );
    };
}
