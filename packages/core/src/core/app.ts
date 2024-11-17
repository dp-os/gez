import { pathToFileURL } from 'node:url';
import { createLoaderImport } from '@gez/import';
import type { Gez } from './gez';
import { type Middleware, createMiddleware } from './middleware';
import {
    RenderContext,
    type RenderContextOptions,
    type ServerRenderHandle
} from './render-context';

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
    build?: () => Promise<boolean>;
    /**
     * 销毁实例，释放内存
     */
    destroy?: () => Promise<boolean>;
}

export async function createApp(gez: Gez): Promise<App> {
    const render =
        gez.command === gez.COMMAND.start
            ? createStartRender(gez)
            : createErrorRender(gez);
    return {
        middleware: createMiddleware(gez),
        render
    };
}

function createStartRender(gez: Gez) {
    const baseURL = pathToFileURL(gez.root) as URL;
    const importMap = gez.getServerImportMap();
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
        throw new Error(`Custom rendering function not implemented`);
    };
}
