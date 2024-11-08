import type { BuildTarget, Gez } from '@gez/core';
import { moduleLinkPlugin } from '@gez/rspack-module-link';
import {
    type ExternalItem,
    type Plugins,
    type RspackOptions,
    rspack
} from '@rspack/core';
import nodeExternals from 'webpack-node-externals';

/**
 * 构建 Client、Server、Node 的基础配置
 */
export function createRspackConfig(
    gez: Gez,
    buildTarget: BuildTarget
): RspackOptions {
    const isWebApp = buildTarget === 'client' || buildTarget === 'server';
    return {
        /**
         * 项目根目录，不可修改
         */
        context: gez.root,
        entry: (() => {
            const importPaths: string[] = [];
            switch (buildTarget) {
                case 'client':
                    importPaths.push(gez.getProjectPath(`src/entry.client.ts`));
                    !gez.isProd &&
                        importPaths.push(
                            `${resolve('webpack-hot-middleware/client')}?path=${gez.base}hot-middleware&timeout=5000&overlay=false`
                        );
                    break;
                case 'server':
                    importPaths.push(gez.getProjectPath(`src/entry.server.ts`));
                    break;
                case 'node':
                    importPaths.push(gez.getProjectPath(`src/entry.node.ts`));
                    break;
            }
            return {
                './entry': {
                    import: importPaths,
                    library: {
                        type: 'module'
                    }
                }
            };
        })(),
        output: {
            clean: true,
            module: true,
            chunkFormat: gez.isProd ? 'module' : undefined,
            chunkLoading: gez.isProd ? 'import' : undefined,
            chunkFilename: 'js/[name].[contenthash:8].js',
            filename:
                buildTarget === 'client' && gez.isProd
                    ? '[name].[contenthash:8].js'
                    : '[name].js',
            cssFilename: gez.isProd
                ? 'css/[name].[contenthash:8].css'
                : 'css/[name].css',
            cssChunkFilename: gez.isProd
                ? 'css/[name].[contenthash:8].css'
                : 'css/[name].css',
            publicPath:
                buildTarget === 'client'
                    ? 'auto'
                    : `${gez.dynamicBaseVar}${gez.base}`,
            uniqueName: gez.varName,
            hotUpdateChunkFilename: '__hot__/[id].[fullhash].hot-update.js',
            path: ((): string => {
                switch (buildTarget) {
                    case 'client':
                        return gez.getProjectPath('dist/client');
                    case 'server':
                        return gez.getProjectPath('dist/server');
                    case 'node':
                        return gez.getProjectPath('dist/node');
                }
            })()
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
                buildTarget === 'client' && !gez.isProd
                    ? new rspack.HotModuleReplacementPlugin()
                    : false
            ];
        })(),
        stats: 'errors-warnings',
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
            },
            extensions: ['.ts', '...']
        },
        optimization: {
            minimize: isWebApp && gez.isProd,
            minimizer: [
                new rspack.SwcJsMinimizerRspackPlugin({
                    minimizerOptions: {
                        format: {
                            comments: false
                        }
                    }
                }),
                new rspack.LightningCssMinimizerRspackPlugin({
                    minimizerOptions: {
                        errorRecovery: false
                    }
                })
            ],
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
            css: true,
            outputModule: true
        },
        devtool: false,
        target: buildTarget === 'client' ? 'web' : 'node20',
        mode: gez.isProd ? 'production' : 'development'
    };
}

function resolve(name: string) {
    return new URL(import.meta.resolve(name)).pathname;
}
