import type { Gez } from '@gez/core';
import { moduleLinkPlugin } from '@gez/rspack-module-link-plugin';
import {
    type ExternalItem,
    type Plugins,
    type RspackOptions,
    rspack
} from '@rspack/core';
import nodeExternals from 'webpack-node-externals';
import type { RspackAppOptions } from './app';
import type { BuildTarget } from './build-target';

/**
 * 构建 Client、Server、Node 的基础配置
 */
export function createRspackConfig(
    gez: Gez,
    buildTarget: BuildTarget,
    options: RspackAppOptions
): RspackOptions {
    const moduleType = options.module ?? 'auto';
    const isWebApp = buildTarget === 'client' || buildTarget === 'server';
    const isHot =
        (buildTarget === 'client' && !gez.isProd && moduleType === 'auto') ||
        moduleType === 'module';

    const libraryType =
        moduleType === 'auto'
            ? gez.isProd
                ? 'modern-module'
                : 'module'
            : moduleType;
    return {
        /**
         * 项目根目录，不可修改
         */
        context: gez.root,
        entry: (() => {
            const importPaths: string[] = [];
            switch (buildTarget) {
                case 'client':
                    importPaths.push(gez.resolvePath('src/entry.client.ts'));
                    isHot &&
                        importPaths.push(
                            `${resolve('webpack-hot-middleware/client')}?path=${gez.basePath}hot-middleware&timeout=5000&overlay=false`
                        );
                    break;
                case 'server':
                    importPaths.push(gez.resolvePath('src/entry.server.ts'));
                    break;
                case 'node':
                    importPaths.push(gez.resolvePath('src/entry.node.ts'));
                    break;
            }
            return {
                [`./src/entry.${buildTarget}`]: {
                    import: importPaths
                }
            };
        })(),
        /*
            https://web.dev/learn/performance/code-split-javascript#dont_inadvertently_disable_streaming_compilation
            使用模块或不使用模块都无法通过 MIME 类型来区分，对于 v8 引擎来说，使用 .mjs 后缀的文件会被当作模块处理，可以保持流式编译
            虽然没有在其他任何文章找到相关信息，但宁可信其有吧
        */
        output: {
            clean: true,
            module: true,
            chunkFormat: gez.isProd ? 'module' : undefined,
            chunkLoading: gez.isProd ? 'import' : undefined,
            chunkFilename: gez.isProd
                ? 'chunks/[name].[contenthash:8].final.mjs'
                : 'chunks/[name].mjs',
            library: {
                type: libraryType
            },
            filename:
                buildTarget !== 'node' && gez.isProd
                    ? '[name].[contenthash:8].final.mjs'
                    : '[name].mjs',
            cssFilename: gez.isProd
                ? '[name].[contenthash:8].final.css'
                : '[name].css',
            cssChunkFilename: gez.isProd
                ? 'chunks/[name].[contenthash:8].final.css'
                : 'chunks/[name].css',
            publicPath:
                buildTarget === 'client'
                    ? 'auto'
                    : `${gez.basePathPlaceholder}${gez.basePath}`,
            uniqueName: gez.varName,
            hotUpdateChunkFilename: '__hot__/[id].[fullhash].hot-update.mjs',
            path: ((): string => {
                switch (buildTarget) {
                    case 'client':
                        return gez.resolvePath('dist/client');
                    case 'server':
                        return gez.resolvePath('dist/server');
                    case 'node':
                        return gez.resolvePath('dist/node');
                }
            })(),
            environment: {
                nodePrefixForCoreModules: true
            }
        },
        // 默认插件，不可修改
        plugins: ((): Plugins => {
            return [
                // 进度条插件
                new rspack.ProgressPlugin({
                    prefix: buildTarget
                }),
                // 模块链接插件
                isWebApp ? moduleLinkPlugin(gez.moduleConfig) : false,
                // 热更新插件
                isHot ? new rspack.HotModuleReplacementPlugin() : false
            ];
        })(),
        module: {
            parser: {
                javascript: {
                    importMeta: false
                }
            },
            generator: {
                asset: {
                    emit: buildTarget === 'client'
                },
                'asset/resource': {
                    emit: buildTarget === 'client'
                }
            },
            rules: []
        },
        resolve: {
            alias: {
                [gez.name]: gez.root
            }
        },
        optimization: {
            minimize: options.minimize ?? gez.isProd,
            concatenateModules: gez.isProd || libraryType === 'modern-module',
            splitChunks: {
                chunks: 'async'
            }
        },
        externalsPresets: {
            web: buildTarget === 'client',
            node: buildTarget === 'server' || buildTarget === 'node'
        },
        externalsType: 'module-import',
        externals: ((): ExternalItem[] => {
            if (buildTarget === 'node') {
                return [
                    // @ts-ignore
                    nodeExternals({
                        // @ts-ignore
                        importType: 'module-import'
                    })
                ];
            }
            return [];
        })(),
        experiments: {
            outputModule: true,
            rspackFuture: {
                bundlerInfo: { force: false }
            }
        },
        target: buildTarget === 'client' ? 'web' : 'node22',
        mode: gez.isProd ? 'production' : 'development',
        cache: false
    };
}

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
