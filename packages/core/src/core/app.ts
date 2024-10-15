import type { IncomingMessage, ServerResponse } from 'node:http';

import * as serveStatic from 'serve-static';

import path from 'node:path';

import type { Gez } from './gez';
import { ServerContext, type ServerRenderHandle } from './server-context';
import { compression, decompression } from './version';

export type Middleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next?: Function
) => void;

export interface App {
    /**
     * 中间件列表
     */
    middlewares: Middleware[];
    /**
     * 渲染函数
     * @param params 渲染的参数
     * @returns
     */
    render: (params?: any) => Promise<ServerContext>;
    /**
     * 执行构建
     */
    build: () => Promise<void>;
    /**
     * 生成远程的压缩包
     */
    zip: () => Promise<void>;
    /**
     * 销毁实例，释放内存
     */
    destroy: () => Promise<void>;
    /**
     * 安装依赖执行命令
     */
    install: () => Promise<void>;
}

export async function createApp(gez: Gez): Promise<App> {
    return {
        middlewares: gez.moduleConfig.imports.map((item) => {
            const base = `/${item.name}/`;
            const staticMiddleware = serveStatic.default(
                path.resolve(item.localPath, 'client'),
                {
                    setHeaders(res) {
                        res.setHeader(
                            'cache-control',
                            'public, max-age=31536000'
                        );
                    }
                }
            );
            return (
                req: IncomingMessage,
                res: ServerResponse,
                next?: Function
            ) => {
                const url = req.url;
                const _next = () => {
                    if (typeof next === 'function') {
                        next();
                    } else {
                        res.writeHead(404, {
                            'Content-Type': 'text/html;charset=UTF-8'
                        });
                        res.end('Not Found');
                    }
                };
                if (typeof url === 'string' && url.startsWith(base)) {
                    req.url = url.substring(base.length - 1);
                    staticMiddleware(req, res, (err) => {
                        req.url = url;
                        _next();
                    });
                } else {
                    _next();
                }
            };
        }),
        async render(params: any) {
            const context = new ServerContext(gez);
            const result = await import(
                gez.getProjectPath('dist/server/entry.js')
            );
            const serverRender: ServerRenderHandle = result.default;
            if (typeof serverRender === 'function') {
                await serverRender(context, params);
            }

            return context;
        },
        async build() {},
        async zip() {
            return compression(gez);
        },
        async destroy() {},
        async install() {
            return decompression(gez);
        }
    };
}
