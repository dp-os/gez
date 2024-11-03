import type { Gez } from './gez';
import { type Middleware, createMiddleware } from './middleware';
import {
    RenderContext,
    type RenderContextOptions,
    type ServerRenderHandle
} from './server-context';
import { compression, decompression } from './version';

export interface App {
    /**
     * 中间件列表
     */
    middleware: Middleware;
    /**
     * 渲染函数
     * @param options 透传给 RenderContextOptions
     * @returns
     */
    render: (options?: RenderContextOptions) => Promise<RenderContext>;
    /**
     * 执行构建
     */
    build: () => Promise<boolean>;
    /**
     * 生成远程的压缩包
     */
    release: () => Promise<boolean>;
    /**
     * 销毁实例，释放内存
     */
    destroy: () => Promise<boolean>;
    /**
     * 安装依赖执行命令
     */
    install: () => Promise<boolean>;
}

export async function createApp(gez: Gez): Promise<App> {
    return {
        middleware: createMiddleware(gez),
        async render(options?: RenderContextOptions) {
            const rc = new RenderContext(gez, options);
            const result = await import(
                gez.getProjectPath('dist/server/entry.js')
            );
            const serverRender: ServerRenderHandle = result.default;
            if (typeof serverRender === 'function') {
                await serverRender(rc);
            }

            return rc;
        },
        async build() {
            return true;
        },
        async release() {
            return compression(gez);
        },
        async destroy() {
            return true;
        },
        async install() {
            return decompression(gez, 0);
        }
    };
}
