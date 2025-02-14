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
 * 应用程序实例接口
 *
 * @interface App
 * @description
 * App 接口定义了一个 Gez 应用程序实例的基本结构，包含中间件、渲染函数和可选的构建、销毁方法。
 *
 * @example
 * ```typescript
 * // 创建一个应用实例
 * const app = await createApp(gez, COMMAND.start);
 *
 * // 使用中间件
 * app.middleware.use(async (ctx, next) => {
 *   console.log('请求开始');
 *   await next();
 *   console.log('请求结束');
 * });
 *
 * // 渲染页面
 * const context = await app.render({
 *   url: '/home',
 *   manifest: true
 * });
 * ```
 */
export interface App {
    /**
     * 中间件列表，用于处理请求的中间件链
     */
    middleware: Middleware;
    /**
     * 渲染函数，用于服务端渲染页面
     * @param options - 渲染选项，包含 URL、manifest 等配置
     * @returns 返回渲染上下文，包含渲染结果
     */
    render: (options?: RenderContextOptions) => Promise<RenderContext>;
    /**
     * 执行构建，用于生产环境构建
     * @returns 构建成功返回 true，失败返回 false
     */
    build?: () => Promise<boolean>;
    /**
     * 销毁实例，释放内存和资源
     * @returns 销毁成功返回 true，失败返回 false
     */
    destroy?: () => Promise<boolean>;
}

/**
 * 创建应用程序实例
 *
 * @param gez - Gez 实例，包含应用程序的配置和状态
 * @param command - 执行的命令类型，如 dev、build、preview、start
 * @returns 返回一个 App 实例
 *
 * @example
 * ```typescript
 * import { Gez, COMMAND } from '@gez/core';
 *
 * // 创建 Gez 实例
 * const gez = new Gez({
 *   root: process.cwd(),
 *   isProd: process.env.NODE_ENV === 'production'
 * });
 *
 * // 创建应用实例
 * const app = await createApp(gez, COMMAND.start);
 * ```
 */
export async function createApp(gez: Gez, command: COMMAND): Promise<App> {
    const render =
        command === gez.COMMAND.start
            ? await createStartRender(gez)
            : createErrorRender(gez);
    return {
        middleware: createMiddleware(gez),
        render
    };
}

/**
 * 创建启动时的渲染函数
 *
 * @param gez - Gez 实例
 * @returns 返回一个渲染函数
 * @internal
 *
 * @description
 * 该函数用于创建应用启动时的渲染函数，会加载服务端入口文件并执行渲染。
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

/**
 * 创建错误渲染函数
 *
 * @param gez - Gez 实例
 * @returns 返回一个始终抛出错误的渲染函数
 * @internal
 *
 * @description
 * 该函数用于在非 start 命令时创建一个渲染函数，调用时会抛出未实现的错误。
 */
function createErrorRender(gez: Gez) {
    return (options?: RenderContextOptions) => {
        throw new Error(`Custom rendering function not implemented`);
    };
}
