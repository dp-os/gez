import { type IncomingMessage, type ServerResponse } from 'node:http';

import {
    type App,
    type AppRenderParams,
    COMMAND,
    createMod,
    type Gez,
    ServerContext,
    type ServerRender
} from '@gez/core';
import {
    type MultiCompiler,
    type MultiRspackOptions,
    rspack
} from '@rspack/core';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import {
    createClientConfig,
    createNodeConfig,
    createServerConfig
} from './config';

function middleware(gez: Gez) {
    let compiler: MultiCompiler | null = null;
    let dev = (req: IncomingMessage, res: ServerResponse, next?: Function) => {
        return next?.();
    };
    let hot = dev;
    if (gez.command === COMMAND.dev) {
        compiler = rspack([createClientConfig(gez), createServerConfig(gez)]);
        dev = webpackDevMiddleware(compiler, {
            writeToDisk: true
        }) as any;
        hot = webpackHotMiddleware(compiler);
    }
    return (req: IncomingMessage, res: ServerResponse, next?: Function) => {
        dev(req, res, () => {
            hot(req, res, next);
        });
    };
}

export async function createApp(gez: Gez): Promise<App> {
    return {
        middleware: middleware(gez),
        async render(params: AppRenderParams): Promise<ServerContext> {
            const mod = createMod(
                gez.getProjectPath('dist/server/entry-server.js')
            );
            const { module, dispose } = await mod.import();
            const render: ServerRender | undefined = module.default;
            const context = new ServerContext(gez, params);
            if (typeof render === 'function') {
                await render(context);
            }
            await mod.dispose();
            dispose(gez.getProjectPath('dist/server'));
            return context;
        },
        build() {
            const compiler = rspack([
                createClientConfig(gez),
                createServerConfig(gez),
                createNodeConfig(gez)
            ]);
            let done = () => {};
            compiler.run((err: Error) => {
                if (err) {
                    throw err;
                }
                compiler.close((closeErr: Error) => {
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
