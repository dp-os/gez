import fs from 'node:fs';
import {
    type App,
    COMMAND,
    type Gez,
    type Middleware,
    ServerContext,
    type ServerRenderHandle,
    createApp as _createApp,
    mergeMiddlewares
} from '@gez/core';
import { import$ } from '@gez/import';
import { type RspackOptions, rspack } from '@rspack/core';
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

async function createMiddleware(
    gez: Gez,
    updateBuildContext?: UpdateBuildContext
): Promise<Middleware[]> {
    const middlewares: Middleware[] = [];
    if (gez.command === COMMAND.dev) {
        const { clientConfig, serverConfig } = createConfig(
            gez,
            updateBuildContext
        );

        const clientCompiler = rspack(clientConfig);
        const serverCompiler = rspack(serverConfig);
        // @ts-expect-error
        clientCompiler.outputFileSystem = fs;
        // @ts-expect-error
        serverCompiler.outputFileSystem = fs;
        middlewares.push(
            // @ts-expect-error
            hotMiddleware(clientCompiler, {
                heartbeat: 5000,
                path: `${gez.base}hot-middleware`
            })
        );
        await new Promise<void>((resolve) => {
            clientCompiler.run(() => {
                resolve();
            });
        });
        await new Promise<void>((resolve) => {
            serverCompiler.run(() => {
                resolve();
            });
        });
    }
    return middlewares;
}

export async function createApp(
    gez: Gez,
    updateBuildContext?: UpdateBuildContext
): Promise<App> {
    const app = await _createApp(gez);
    app.middleware = mergeMiddlewares([
        ...(await createMiddleware(gez, updateBuildContext)),
        app.middleware
    ]);

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
