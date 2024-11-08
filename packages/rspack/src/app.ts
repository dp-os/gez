import {
    type App,
    type BuildTarget,
    COMMAND,
    type Gez,
    type Middleware,
    RenderContext,
    type RenderContextOptions,
    type ServerRenderHandle,
    createApp,
    mergeMiddlewares
} from '@gez/core';
import { import$ } from '@gez/import';
import {
    type RspackOptions,
    type SwcLoaderOptions,
    rspack
} from '@rspack/core';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import { createRspackConfig } from './config';

export interface RspackAppConfigContext {
    gez: Gez;
    buildTarget: BuildTarget;
    config: RspackOptions;
    options: RspackAppOptions;
}
export interface RspackAppOptions {
    config?: (context: RspackAppConfigContext) => void;
}

export async function createRspackApp(
    gez: Gez,
    options?: RspackAppOptions
): Promise<App> {
    const app = await createApp(gez);
    if (gez.command === COMMAND.dev) {
        app.middleware = mergeMiddlewares([
            ...(await createMiddleware(gez, options)),
            app.middleware
        ]);
    }

    app.render = rewriteRender(gez);
    app.build = rewriteBuild(gez, options);

    return app;
}
async function createMiddleware(
    gez: Gez,
    options: RspackAppOptions = {}
): Promise<Middleware[]> {
    const middlewares: Middleware[] = [];
    if (gez.command === COMMAND.dev) {
        const clientCompiler = rspack(
            generateBuildConfig(gez, options, 'client')
        );
        const serverCompiler = rspack(
            generateBuildConfig(gez, options, 'server')
        );
        // @ts-expect-error
        devMiddleware(clientCompiler, {
            writeToDisk: true
        });
        // @ts-expect-error
        devMiddleware(serverCompiler, {
            writeToDisk: true
        });
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

function generateBuildConfig(
    gez: Gez,
    options: RspackAppOptions,
    buildTarget: BuildTarget
) {
    const config = createRspackConfig(gez, buildTarget);
    options.config?.({ gez, options, buildTarget, config });

    return config;
}

function rewriteRender(gez: Gez) {
    const { resolve, url } = import.meta;
    const urlObj = new URL(resolve(url));
    urlObj.search = '';
    return async (options?: RenderContextOptions): Promise<RenderContext> => {
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
        const rc = new RenderContext(gez, options);
        if (typeof serverRender === 'function') {
            await serverRender(rc);
        }
        return rc;
    };
}

function rewriteBuild(gez: Gez, options: RspackAppOptions = {}) {
    return async (): Promise<boolean> => {
        const list: (() => Promise<boolean>)[] = [
            () => rspackBuild(generateBuildConfig(gez, options, 'client')),
            () => rspackBuild(generateBuildConfig(gez, options, 'server')),
            () => rspackBuild(generateBuildConfig(gez, options, 'node'))
        ];
        for (const build of list) {
            const successful = await build();
            if (!successful) {
                return false;
            }
        }
        return true;
    };
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
