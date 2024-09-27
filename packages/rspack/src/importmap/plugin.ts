import { type GezModuleConfig } from '@gez/core';
import {
    type Compilation,
    type Compiler,
    type EntryNormalized,
    type EntryStaticNormalized,
    rspack,
    type RspackPluginInstance
} from '@rspack/core';

// import crypto from 'crypto';
import { getEntryConfig, getImportConfig } from './utils';

/**
 * importmap 插件，用于生成 importmap 相关文件
 */
export class ImportmapPlugin implements RspackPluginInstance {
    /**
     * importmap 插件配置
     */
    options: {
        root?: string;
        modules?: GezModuleConfig;
    } = {};

    public constructor(options: { root?: string; modules?: GezModuleConfig }) {
        this.options = options;
    }

    public async apply(compiler: Compiler) {
        const entry: EntryStaticNormalized =
            typeof compiler.options.entry === 'function'
                ? await compiler.options.entry()
                : compiler.options.entry;
        compiler.options.entry = getEntryConfig(this.options, entry);

        compiler.hooks.thisCompilation.tap(
            'importmap-plugin',
            (compilation: Compilation) => {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'importmap-plugin',
                        stage: rspack.Compilation
                            .PROCESS_ASSETS_STAGE_ADDITIONAL
                    },
                    (assets) => {
                        const importmapJson = {
                            imports: {}
                        };
                        const stats = compilation.getStats().toJson({
                            all: false,
                            hash: true,
                            entrypoints: true
                        });
                        const entrypoints = stats.entrypoints || {};
                        importmapJson.imports = Object.entries(
                            entrypoints
                        ).reduce((acc, [key, value]) => {
                            // console.log('@item.assets', key, value.assets);
                            const item = value.assets?.find((item) => {
                                return (
                                    item.name.startsWith(key) &&
                                    item.name.endsWith('.js')
                                );
                            });
                            if (item) {
                                const { name } = item;
                                // console.log('@item', stats.name, key, name);
                                acc[`${stats.name}/${key}`] =
                                    `/${stats.name}/${name}`;
                            }
                            return acc;
                        }, {});
                        // console.log(
                        //     '@importmapJson.imports',
                        //     importmapJson.imports
                        // );

                        const { modules } = this.options || {};
                        if (modules) {
                            const importConfig = getImportConfig(modules);
                            Object.assign(
                                importmapJson.imports,
                                importConfig.imports
                            );
                            const importTargets = Object.keys(
                                importConfig.targets
                            );
                            // const hash = crypto
                            //     .createHash('sha256')
                            //     .update(result)
                            //     .digest('hex');
                            // console.log('@hash', hash, result);
                            // console.log('@importTargets', importTargets);
                        }

                        const { RawSource } = compiler.webpack.sources;

                        const importmapJs = `
((global) => {
    const importsMap = ${JSON.stringify(importmapJson.imports)};
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
                            'importmap.json',
                            new RawSource(
                                JSON.stringify(importmapJson, null, 4)
                            )
                        );

                        // console.log(stats, this.options);
                    }
                );
            }
        );
    }
}
