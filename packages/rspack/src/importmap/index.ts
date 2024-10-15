import type { PackageJson, ParsedModuleConfig } from '@gez/core';
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
        const { options } = this;
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
                        const exports: Record<string, string> = {};
                        const hash = stats.hash ?? String(Date.now());
                        const importmapHash = `importmap.${hash}.js`;
                        const files = [
                            importmapHash,
                            ...Object.keys(assets).map(transFileName)
                        ];
                        Object.entries(entrypoints).forEach(([key, value]) => {
                            const asset = value.assets?.[0];
                            if (!asset) return;
                            if (
                                !key.startsWith('./') &&
                                !asset.name.endsWith('.js')
                            )
                                return;

                            exports[key] = asset.name;
                        });
                        const packageJson: PackageJson = {
                            name: options.name,
                            version: '1.0.0',
                            hash,
                            type: 'module',
                            exports: exports,
                            files
                        };

                        const { RawSource } = compiler.webpack.sources;
                        const code = toImportmapJsCode(options.name, exports);
                        compilation.emitAsset(
                            'importmap.js',
                            new RawSource(code)
                        );
                        compilation.emitAsset(
                            importmapHash,
                            new RawSource(code)
                        );

                        compilation.emitAsset(
                            'package.json',
                            new RawSource(JSON.stringify(packageJson, null, 4))
                        );
                    }
                );
            }
        );
    }
}

function toImportmapJsCode(name: string, imports: Record<string, string>) {
    return `
    ((global) => {
        const name = '${name}';
        const importsMap = ${JSON.stringify(imports)};
        const importmapKey = '__importmap__';
        const importmap = global[importmapKey] = global[importmapKey] || {};
        const imports = importmap.imports = importmap.imports || {};
        const joinName = (value) => {
            return name + value.substring(1);
        }
        Object.entries(importsMap).forEach(([key, value]) => {
            imports[joinName(key)] = '/' + joinName(value);
        });
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
