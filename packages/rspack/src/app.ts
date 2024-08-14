import { type IncomingMessage, type ServerResponse } from 'node:http';

import {
    type App,
    type AppRenderParams,
    COMMAND,
    type Gez,
    ServerContext,
    type ServerRender
} from '@gez/core';
import { type Compiler, rspack } from '@rspack/core';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import type { ConfigCallback } from './config';
import { importEsm } from './import-esm';

function middleware(gez: Gez, config: ConfigCallback) {
    let clientCompiler: Compiler | null = null;
    let dev = (req: IncomingMessage, res: ServerResponse, next?: Function) => {
        return next?.();
    };
    let hot = dev;
    if (gez.command === COMMAND.dev) {
        const clientConfig = config(gez, 'client');
        const serverConfig = config(gez, 'server');
        clientCompiler = rspack(clientConfig);
        const serverCompiler = rspack(serverConfig);
        // @ts-expect-error
        webpackDevMiddleware(serverCompiler, {
            publicPath: gez.base,
            writeToDisk: true
        });
        // @ts-expect-error
        dev = webpackDevMiddleware(clientCompiler, {
            writeToDisk: true,
            publicPath: gez.base
        });
        // @ts-expect-error
        hot = webpackHotMiddleware(clientCompiler, {
            heartbeat: 5000,
            path: `${gez.base}hot-middleware`
        });
    }
    return (req: IncomingMessage, res: ServerResponse, next?: Function) => {
        dev(req, res, () => {
            hot(req, res, next);
        });
    };
}

export async function createApp(
    gez: Gez,
    config: ConfigCallback
): Promise<App> {
    return {
        middleware: middleware(gez, config),
        async render(params: AppRenderParams): Promise<ServerContext> {
            const module = await importEsm(
                gez.getProjectPath('dist/server/entry-server.js')
            );
            const render: ServerRender | undefined = module.default;
            const context = new ServerContext(gez, params);
            if (typeof render === 'function') {
                await render(context);
            }
            return context;
        },
        build() {
            const clientConfig = config(gez, 'client');
            const serverConfig = config(gez, 'server');
            const nodeConfig = config(gez, 'node');
            const compiler = rspack([clientConfig, serverConfig, nodeConfig]);
            let done = () => {};
            compiler.run((err: Error) => {
                if (err) {
                    throw err;
                }
                compiler.close((closeErr) => {
                    if (err) {
                        throw closeErr;
                    }
                    done();
                });
            });
            return new Promise<void>((resolve) => {
                done = resolve;
            });
        },
        async destroy() {}
    };
}
