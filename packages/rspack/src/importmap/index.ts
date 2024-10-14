import type { ManifestJson, ParsedModuleConfig } from '@gez/core';
import {
    type Assets,
    type Compilation,
    type Compiler,
    type RspackPluginInstance,
    rspack
} from '@rspack/core';
/**
 * importmap 插件，用于生成 importmap 相关文件
 */
export class ImportmapPlugin implements RspackPluginInstance {
    public options: ParsedModuleConfig;

    public constructor(options: ParsedModuleConfig) {
        this.options = options;
    }
    public apply(compiler: Compiler) {
        this.applyEntry(compiler);
        this.applyExternals(compiler);
        this.applyAssets(compiler);
    }

    public applyEntry(compiler: Compiler) {
        const { exports } = this.options;
        if (typeof compiler.options.entry === 'function') {
            throw new TypeError(`'entry' option does not support functions`);
        }
        const entry = compiler.options.entry;
        exports.forEach(({ exportName, exportPath }) => {
            entry[exportName] = {
                import: [exportPath],
                library: {
                    type: 'module'
                }
            };
        });
    }
    public applyExternals(compiler: Compiler) {
        const externals = compiler.options.externals || [];
        const options = this.options.externals;
        if (!Array.isArray(externals)) {
            throw new TypeError(`'externals' configuration must be an array`);
        }
        Object.entries(options).forEach(([key, value]) => {
            externals.push(
                (
                    { request, contextInfo }: any,
                    callback: (...args: any[]) => any
                ) => {
                    if (contextInfo.issuer && value.match.test(request)) {
                        const moduleImport = value.import ?? request;
                        return callback(null, `module-import ${moduleImport}`);
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
                            assets: true,
                            hash: true,
                            entrypoints: true
                        });
                        const entrypoints = stats.entrypoints || {};
                        const entryMap: Record<string, string> = {};
                        const imports: Record<string, string> = Object.entries(
                            entrypoints
                        ).reduce((acc, [key, value]) => {
                            const item = value.assets?.[0];
                            if (item) {
                                key = key.replace(/^\.\//, '');
                                const name = item.name.replace(/^\.\//, '');
                                acc[`${stats.name}/${key}`] =
                                    `/${stats.name}/${name}`;

                                entryMap[`./${key}`] = `./${name}`;
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

                        const manifest: ManifestJson = {
                            name: this.options.name,
                            version: stats.hash || '',
                            files: Object.keys(assets).map(transFileName),
                            importmapFilePath: `importmap.${stats.hash}.js`
                        };

                        // 将 manifest 写入文件
                        compilation.emitAsset(
                            'manifest.json',
                            new RawSource(JSON.stringify(manifest, null, 4))
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

/**
 * 使用正则表达式替换文件名中的前导点和斜杠为空字符串
 * @param {string} fileName - 要转换的文件名
 * @returns 转换后的文件名，不包含前导点和斜杠
 *
 * @example transFileName("./example.txt") => "example.txt"
 */
function transFileName(fileName: string): string {
    return fileName.replace(/^.\//, '');
}
