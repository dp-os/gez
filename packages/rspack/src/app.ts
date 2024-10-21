import type { IncomingMessage, ServerResponse } from 'node:http';
import { pathToFileURL } from 'node:url';
import {
    type App,
    COMMAND,
    type Gez,
    ServerContext,
    type ServerRenderHandle,
    createApp as _createApp
} from '@gez/core';
import { import$ } from '@gez/import';
import { type Compiler, type RspackOptions, rspack } from '@rspack/core';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

import {
    type BuildTarget,
    type UpdateBuildContext,
    createBuildContext
} from './build-config';

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
        devMiddleware(serverCompiler, {
            publicPath: gez.base,
            writeToDisk: true
        });
        // @ts-expect-error
        dev = devMiddleware(clientCompiler, {
            writeToDisk: true,
            publicPath: gez.base
        });
        // @ts-expect-error
        hot = hotMiddleware(clientCompiler, {
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

    const { resolve, url } = import.meta;
    const urlObj = new URL(resolve(url));
    urlObj.search = '';

    app.render = async (params: any): Promise<ServerContext> => {
        const module = await import$(
            gez.getProjectPath('dist/server/entry.js'),
            urlObj.href,
            {
                console,
                setTimeout,
                clearTimeout,
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
        const list: BuildItem[] = [
            {
                target: 'client',
                build: () => rspackBuild(clientConfig)
            },
            {
                target: 'server',
                build: () => rspackBuild(serverConfig)
            },
            {
                target: 'node',
                build: () => rspackBuild(nodeConfig)
            }
        ];
        for (const item of list) {
            const successful = await item.build();
            if (!successful) {
                return false;
            }
        }
        return true;
    };
    return app;
}

interface BuildItem {
    target: BuildTarget;
    build: () => Promise<boolean>;
}

async function rspackBuild(options: RspackOptions) {
    const ok = await new Promise<boolean>((resolve) => {
        const compiler = rspack(options);
        compiler.run((err, stats) => {
            if (err) {
                console.error(err);
                resolve(false);
                return;
            } else if (stats?.hasErrors()) {
                stats.toJson({ errors: true }).errors?.forEach((err) => {
                    console.error(err);
                });

                return resolve(false);
            }
            compiler.close((err) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    });
    // 避免前面的进度条被 rspack.ProgressPlugin 清理了
    ok && console.log('');
    return ok;
}
