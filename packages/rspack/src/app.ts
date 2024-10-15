import type { IncomingMessage, ServerResponse } from 'node:http';

import {
    type App,
    COMMAND,
    type Gez,
    ServerContext,
    type ServerRenderHandle,
    createApp as _createApp,
    buildImportmap,
    installImportmap
} from '@gez/core';
import { type Compiler, rspack } from '@rspack/core';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import type { ConfigCallback } from './config';
import { importEsmInactive } from './import-esm';

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
    const app = await _createApp(gez);
    app.middlewares.unshift(middleware(gez, config));
    app.render = async (params: any): Promise<ServerContext> => {
        const module = await importEsmInactive(
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
        const clientConfig = config(gez, 'client');
        const serverConfig = config(gez, 'server');
        const nodeConfig = config(gez, 'node');
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
    app.zip = async () => {
        buildImportmap(gez);
    };
    app.install = async () => {
        console.log('install');
        installImportmap(gez);
    };
    return app;
}
