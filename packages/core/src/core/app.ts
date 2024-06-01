import {
    type IncomingHttpHeaders,
    type IncomingMessage,
    type ServerResponse
} from 'node:http';

import serveStatic from 'serve-static';

import { ServerContext, type ServerRender } from '../server/server-context';
import { type Gez } from './gez';

export interface AppRenderParams {
    url: string;
    timeout?: number;
    headers?: IncomingHttpHeaders;
    extra?: Record<string, any>;
}

export interface App {
    middleware: (
        req: IncomingMessage,
        res: ServerResponse,
        next?: Function
    ) => void;
    render: (params: AppRenderParams) => Promise<ServerContext>;
    build: () => Promise<void>;
    destroy: () => Promise<void>;
}

export async function createApp(gez: Gez): Promise<App> {
    const root = gez.getProjectPath('dist/client');
    const middleware = serveStatic(root, {
        setHeaders(res) {
            res.setHeader('cache-control', 'public, max-age=31536000');
        }
    }) as App['middleware'];
    return {
        middleware(req, res, next) {
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
            if (typeof url === 'string' && url.startsWith(gez.base)) {
                req.url = url.substring(gez.base.length - 1);
                middleware(req, res, () => {
                    req.url = url;
                    _next();
                });
            } else {
                _next();
            }
        },
        async render(params: AppRenderParams) {
            const context = new ServerContext(gez, params);
            const result = await import(
                /* @vite-ignore */
                gez.getProjectPath('dist/server/entry-server.js')
            );
            const serverRender: ServerRender = result.default;
            if (typeof serverRender === 'function') {
                await serverRender(context);
            }

            return context;
        },
        async build() {},
        async destroy() {}
    };
}
