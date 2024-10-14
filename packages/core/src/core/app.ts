import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';

import * as serveStatic from 'serve-static';

import path from 'node:path';

import {
    ServerContext,
    type ServerRenderHandle
} from '../server/server-context';
import type { Gez } from './gez';

export type Middleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next?: Function
) => void;

export interface ImportMapConfig {
    list: Array<{
        scope: string;
        source: string;
        target: string;
    }>;
    map: Record<string, string>;
}

export interface App {
    middlewares: Middleware[];
    render: (params: any) => Promise<ServerContext>;
    build: () => Promise<void>;
    zip: () => Promise<void>;
    destroy: () => Promise<void>;
    install: () => Promise<void>;
    getImportmapConfig: () => ImportMapConfig;
}

export async function createApp(gez: Gez): Promise<App> {
    // const serveStatic = await import('serve-static');
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
                        if (err) {
                            req.url = url;
                            _next();
                        }
                    });
                } else {
                    _next();
                }
            };
        }),
        async render(params: any) {
            const context = new ServerContext(gez);
            const result = await import(
                /* @vite-ignore */
                gez.getProjectPath('dist/server/entry-server.js')
            );
            const serverRender: ServerRenderHandle = result.default;
            if (typeof serverRender === 'function') {
                await serverRender(context, params);
            }

            return context;
        },
        async build() {},
        async zip() {},
        async destroy() {},
        async install() {},
        getImportmapConfig() {
            const importMapConfig: ImportMapConfig = {
                list: [],
                map: {}
            };
            gez.moduleConfig.imports.map(async (item) => {
                const { name, localPath } = item;
                try {
                    const manifest: {
                        version: string;
                        files: string[];
                        importmapFilePath: string;
                        importmap: Record<string, string>;
                    } = JSON.parse(
                        fs
                            .readFileSync(
                                path.resolve(localPath, 'client/manifest.json')
                            )
                            .toString()
                    );
                    Object.entries(manifest.importmap).forEach(
                        ([key, value]) => {
                            const source = `${name}/${key}`;
                            const target = `${name}/${value}`;
                            importMapConfig.list.push({
                                scope: name,
                                source,
                                target
                            });
                            importMapConfig.map[source] = target;
                        }
                    );
                } catch (error) {}
            });
            return importMapConfig;
        }
    };
}
