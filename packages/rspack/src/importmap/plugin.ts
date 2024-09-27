import { type GezModuleConfig } from '@gez/core';
import {
    type Compilation,
    type Compiler,
    rspack,
    type RspackPluginInstance
} from '@rspack/core';
// import crypto from 'crypto';

/**
 * importmap 插件，用于生成 importmap 相关文件
 */
export class ImportmapPlugin implements RspackPluginInstance {
    /**
     * importmap 插件配置
     */
    options?: GezModuleConfig;

    public constructor(options?: GezModuleConfig) {
        this.options = options;
    }

    public apply(compiler: Compiler) {
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
                        const files = Object.keys(entrypoints)
                            .map((name) => {
                                const item = entrypoints[name];
                                const file = item.assets?.find((item) => {
                                    return item.name.endsWith('.js');
                                });
                                if (file) {
                                    return {
                                        name,
                                        file: file.name
                                    };
                                }
                                return null;
                            })
                            .filter((item) => item);
                        importmapJson.imports = files.reduce<
                            Record<string, string>
                        >((obj, item) => {
                            if (item) {
                                const { name, file } = item;
                                const key = `${stats.name}/${name}`;
                                const value = `/${stats.name}/${file}`;
                                obj[key] = value;
                            }
                            return obj;
                        }, {});

                        if (this.options) {
                            const { importBase, imports = [] } = this.options;
                            const regex = /^(.*?)\/(.*)$/; // 使用正则表达式匹配第一个/符号
                            const importTargets = imports.reduce<{
                                targets: Record<string, Record<string, string>>;
                                imports: Record<string, string>;
                            }>(
                                (acc, item) => {
                                    const match = item.match(regex);

                                    if (match) {
                                        const [, part1, part2] = match;
                                        const origin =
                                            importBase[part1] ||
                                            importBase['*'] ||
                                            '';
                                        const fullPath = `${origin}/${item}`;

                                        const target = acc.targets[part1];
                                        if (target) {
                                            target[item] = fullPath;
                                        } else {
                                            acc.targets[part1] = {
                                                [item]: fullPath
                                            };
                                        }
                                        acc.imports[item] = fullPath;
                                    }
                                    return acc;
                                },
                                {
                                    targets: {},
                                    imports: {}
                                }
                            );
                            Object.assign(
                                importmapJson.imports,
                                importTargets.imports
                            );
                            const importList = Object.keys(
                                importTargets.targets
                            );
                            // const hash = crypto
                            //     .createHash('sha256')
                            //     .update(result)
                            //     .digest('hex');
                            // console.log('@hash', hash, result);
                            console.log('@importTargets', importTargets);
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
