import type { ParsedModuleConfig } from '@gez/core';
import {
    type Assets,
    type Compilation,
    type Compiler,
    type RspackPluginInstance,
    rspack
} from '@rspack/core';

export interface ImportmapData {
    /**
     * 当前编译的版本号
     */
    version: string;
    /**
     * 映射文件的路径
     */
    importmapFilePath: string;
    imports: Record<string, string>;
    exposes: Record<string, string>;
}

/**
 * importmap 插件，用于生成 importmap 相关文件
 */
export class ImportmapPlugin implements RspackPluginInstance {
    public options: ParsedModuleConfig;

    public constructor(options: ParsedModuleConfig) {
        console.log('>>>>>>>', options);
        this.options = options;
    }
    public apply(compiler: Compiler) {
        this.applyEntry(compiler);
        this.applyExternals(compiler);
        this.applyAssets(compiler);
    }

    public applyEntry(compiler: Compiler) {
        const _entry = compiler.options.entry;
        const wrapEntry =
            typeof _entry === 'function' ? _entry : async () => _entry;
        const options = this.options.exports;
        compiler.options.entry = async () => {
            const result = await wrapEntry();
            Object.entries(options).forEach(([key, value]) => {
                result[key] = {
                    import: [value],
                    asyncChunks: false,
                    library: {
                        type: 'module'
                    }
                };
            });
            return result;
        };
    }
    public applyExternals(compiler: Compiler) {
        const externals = compiler.options.externals || [];
        const options = this.options.externals;
        if (!Array.isArray(externals)) {
            throw new Error(`'externals' configuration must be an array`);
        }
        Object.entries(options).forEach(([key, value]) => {
            externals.push(
                (
                    { request, contextInfo }: any,
                    callback: (...args: any[]) => any
                ) => {
                    if (contextInfo.issuer && value.test(request)) {
                        return callback(null, 'module-import ' + request);
                    }
                    callback();
                }
            );
        });
        compiler.options.externalsType = 'module-import';
        compiler.options.externals = externals;
    }
    public applyAssets(compiler: Compiler) {
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
                        const stats = compilation.getStats().toJson({
                            all: false,
                            hash: true,
                            entrypoints: true
                        });
                        const entrypoints = stats.entrypoints || {};
                        const entryMap: Record<string, string> = {};
                        const imports: Record<string, string> = Object.entries(
                            entrypoints
                        ).reduce((acc, [key, value]) => {
                            console.log('@item.assets', key, value.assets);
                            const item = value.assets?.[0];
                            if (item) {
                                key = key.replace(/^\.\//, '');
                                const name = item.name.replace(/^\.\//, '');
                                acc[`${stats.name}/${key}`] =
                                    `/${stats.name}/${name}`;

                                entryMap[key] = `./${name}`;
                            }
                            return acc;
                        }, {});

                        const { RawSource } = compiler.webpack.sources;
                        const code = toImportmapJsCode(imports);
                        compilation.emitAsset(
                            'importmap.js',
                            new RawSource(code)
                        );
                        compilation.emitAsset(
                            `importmap.${stats.hash}.js`,
                            new RawSource(code)
                        );

                        compilation.emitAsset(
                            'package.json',
                            new RawSource(
                                JSON.stringify(
                                    {
                                        name: this.options.name,
                                        version: '1.0.0',
                                        type: 'module',
                                        exports: entryMap
                                    },
                                    null,
                                    4
                                )
                            )
                        );
                    }
                );
            }
        );
    }
}

function toImportmapJsCode(imports: Record<string, string>) {
    return `
    ((global) => {
        const importsMap = ${JSON.stringify(imports)};
        const importmapKey = '__importmap__';
        const importmap = global[importmapKey] = global[importmapKey] || {};
        const imports = importmap.imports = importmap.imports || {};
        Object.assign(imports, importsMap);
    })(globalThis);
    `;
}
