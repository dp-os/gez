import type { GezModuleConfig } from '@gez/core';
import {
    type Assets,
    type Compilation,
    type Compiler,
    type EntryStaticNormalized,
    type Externals,
    type RspackPluginInstance,
    // type ResolveAlias,
    rspack
} from '@rspack/core';
import crypto from 'crypto-js';

import {
    // getAlias,
    getEntryConfig,
    getExternals,
    getImportMapConfig
} from './utils';

export interface ImportmapData {
    version: string;
    importmapFilePath: string;
    imports: Record<string, string>;
    exposes: Record<string, string>;
}

/**
 * importmap 插件，用于生成 importmap 相关文件
 */
export class ImportmapPlugin implements RspackPluginInstance {
    /**
     * importmap 插件配置
     */
    options: {
        name?: string;
        root?: string;
        modules?: GezModuleConfig;
    } = {};

    public constructor(options: {
        name?: string;
        root?: string;
        modules?: GezModuleConfig;
    }) {
        this.options = options;
    }

    public async apply(compiler: Compiler) {
        /**
         * 修改 entry
         * 将导出的模块加入到 entry 里
         */
        const entry: EntryStaticNormalized =
            typeof compiler.options.entry === 'function'
                ? await compiler.options.entry()
                : compiler.options.entry;
        compiler.options.entry = getEntryConfig(this.options, entry);

        /**
         * 修改 alias
         * 将引入的模块加入到 alias 别名里
         */
        // const alias: ResolveAlias = getAlias(
        //     this.options,
        //     compiler.options.resolve.alias || {}
        // );
        // compiler.options.resolve.alias = alias;
        // console.log('@alias', compiler.options.resolve.alias);

        /**
         * 修改 externals
         * 将引入的模块加入到外部依赖
         */
        const externals: Externals = getExternals(
            this.options,
            compiler.options.externals || {}
        );
        compiler.options.externals = externals;
        // console.log('@externals', compiler.options.externals);

        compiler.hooks.thisCompilation.tap(
            'importmap-plugin',
            (compilation: Compilation) => {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'importmap-plugin',
                        stage: rspack.Compilation
                            .PROCESS_ASSETS_STAGE_ADDITIONAL
                    },
                    (assets: Assets) => {
                        const importmapData: ImportmapData = {
                            version: '',
                            importmapFilePath: 'importmap.js',
                            imports: {},
                            exposes: {}
                        };
                        const { modules } = this.options || {};
                        const importConfig = getImportMapConfig(modules);

                        const stats = compilation.getStats().toJson({
                            all: false,
                            hash: true,
                            entrypoints: true
                        });
                        const entrypoints = stats.entrypoints || {};
                        const entryMap: Record<string, string> = {};
                        importmapData.imports = Object.entries(
                            entrypoints
                        ).reduce((acc, [key, value]) => {
                            console.log('@item.assets', key, value.assets);
                            const item = value.assets?.find((item) => {
                                return (
                                    item.name.startsWith(key) &&
                                    item.name.endsWith('.js')
                                );
                            });
                            if (item) {
                                const { name } = item;
                                acc[`${stats.name}/${key}`] =
                                    `/${stats.name}/${name}`;
                                entryMap[key] = name;
                            }
                            return acc;
                        }, {});
                        // console.log(
                        //     '@importmapData.imports',
                        //     importmapData.imports
                        // );

                        Object.assign(
                            importmapData.imports,
                            importConfig.imports
                        );

                        importmapData.exposes = importConfig.exposes.reduce<
                            Record<string, string>
                        >((acc, item) => {
                            const key = item.replace(/^\.\//, '');
                            if (entryMap[key]) {
                                acc[`./${key}`] = `./${entryMap[key]}`;
                            }
                            return acc;
                        }, {});
                        // console.log(
                        //     '@importmapData.exposes',
                        //     importmapData.exposes
                        // );

                        // const importTargets = Object.keys(importConfig.targets);
                        // console.log('@importTargets', importTargets);

                        // importmap 数据的 json 字符串
                        const importmapDataJson = JSON.stringify(importmapData);
                        // importmap 数据的 json 字符串的 内容哈希
                        const contenthash = crypto
                            .MD5(importmapDataJson)
                            .toString()
                            .slice(0, 8);
                        const importmapFileName = `importmap.${contenthash}.js`;
                        importmapData.version = contenthash;
                        importmapData.importmapFilePath = importmapFileName;

                        const { RawSource } = compiler.webpack.sources;

                        const importmapJs = `
((global) => {
    const importsMap = ${JSON.stringify(importmapData.imports)};
    const importmapKey = '__importmap__';
    const importmap = global[importmapKey] = global[importmapKey] || {};
    const imports = importmap.imports = importmap.imports || {};
    Object.assign(imports, importsMap);
})(globalThis);
`.trim();
                        compilation.emitAsset(
                            'importmap.js',
                            new RawSource(importmapJs)
                        );
                        compilation.emitAsset(
                            importmapFileName,
                            new RawSource(importmapJs)
                        );

                        compilation.emitAsset(
                            'manifest.json',
                            new RawSource(
                                JSON.stringify(
                                    {
                                        importmap: importmapData
                                    },
                                    null,
                                    4
                                )
                            )
                        );

                        compilation.emitAsset(
                            'package.json',
                            new RawSource(
                                JSON.stringify(
                                    {
                                        name:
                                            this.options.name ||
                                            '@gez/importmap',
                                        version: '1.0.0',
                                        type: 'module',
                                        exports: importmapData.exposes
                                    },
                                    null,
                                    4
                                )
                            )
                        );

                        // console.log(stats, this.options);
                    }
                );
            }
        );
    }
}
