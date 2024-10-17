import type { IncomingMessage, ServerResponse } from 'node:http';
import {
    type App,
    COMMAND,
    type Gez,
    ServerContext,
    type ServerRenderHandle,
    createApp as _createApp
} from '@gez/core';
import { import$ } from '@gez/import';
import { type Compiler, rspack } from '@rspack/core';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { type UpdateBuildContext, createBuildContext } from './build-config';

function createConfig(gez: Gez, updateBuildContext?: UpdateBuildContext) {
    const client = createBuildContext(gez, 'client');
    const server = createBuildContext(gez, 'server');
    const node = createBuildContext(gez, 'node');

    updateBuildContext?.(client);
    updateBuildContext?.(server);
    updateBuildContext?.(node);
    return {
        clientConfig: client.config,
        serverConfig: server.config,
        nodeConfig: node.config
    };
}

function middleware(gez: Gez, updateBuildContext?: UpdateBuildContext) {
    let clientCompiler: Compiler | null = null;
    let dev = (req: IncomingMessage, res: ServerResponse, next?: Function) => {
        return next?.();
    };
    let hot = dev;
    if (gez.command === COMMAND.dev) {
        const { clientConfig, serverConfig } = createConfig(
            gez,
            updateBuildContext
        );

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
    updateBuildContext?: UpdateBuildContext
): Promise<App> {
    const app = await _createApp(gez);
    app.middlewares.unshift(middleware(gez, updateBuildContext));
    app.render = async (params: any): Promise<ServerContext> => {
        const module = await import$(
            gez.getProjectPath('dist/server/entry.js'),
            import.meta.url,
            {
                console,
                process,
                URL,
                global
            }
        );
        const serverRender: ServerRenderHandle = module.default;
        const context = new ServerContext(gez);
        if (typeof serverRender === 'function') {
            await serverRender(context, params);
        }
        return context;
    };
    app.build = async () => {
        const { clientConfig, serverConfig, nodeConfig } = createConfig(
            gez,
            updateBuildContext
        );
        const compiler = rspack([clientConfig, serverConfig, nodeConfig]);
        let done = () => {};
        compiler.run((err) => {
            if (err) {
                throw err;
            }
            compiler.close((closeErr) => {
                if (closeErr) {
                    throw closeErr;
                }
                done();
            });
        });
        return new Promise<void>((resolve) => {
            done = resolve;
        });
    };
    return app;
}
