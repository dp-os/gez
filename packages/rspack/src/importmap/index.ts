import path from 'node:path';

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
                    const getImport = getImportResult(this.options, key, value);
                    const result = getImport(contextInfo.issuer, request);
                    if (result) {
                        return callback(null, `module-import ${result}`);
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
                        this.applyAsset(compiler, compilation, assets);
                    }
                );
            }
        );
    }
    public applyAsset(
        compiler: Compiler,
        compilation: Compilation,
        assets: Assets
    ) {
        const { options } = this;
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
            const asset = value.assets?.find((item) => {
                return item.name.indexOf('.hot-update.') === -1;
            });
            if (!asset) return;
            const target = asset.name;
            if (!key.startsWith('./') && !target.endsWith('.js')) return;

            exports[key] = target;
            // 支持 index 导出; 当导出文件为 src/utils/index.js 时, exports 和 importmap 需要支持 src/utils 和 src/utils/index 的路径使用
            if (key.endsWith('/index')) {
                exports[key.replace(/\/index$/, '')] = target;
            }
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
        compilation.emitAsset('importmap.js', new RawSource(code));
        compilation.emitAsset(importmapHash, new RawSource(code));

        compilation.emitAsset(
            'package.json',
            new RawSource(JSON.stringify(packageJson, null, 4))
        );
    }
}

function toImportmapJsCode(name: string, imports: Record<string, string>) {
    return `
;((global) => {
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
`.trim();
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

/**
 * 根据给定的选项和外部模块配置，返回一个函数，该函数用于处理模块的导入请求
 * @returns 一个函数，该函数接受两个参数：issuer 和 request，并返回一个字符串或 false
 */
function getImportResult(
    options: ParsedModuleConfig,
    externalName: keyof ParsedModuleConfig['externals'],
    externalValue: ParsedModuleConfig['externals'][string]
): (issuer: string, request: string) => string | false {
    const { name: gezName, root } = options;

    /**
     * 匹配的相对路径和别名
     * @example
     * ./serviceName/src/utils/index => ['./serviceName/src/utils/index', './serviceName/src/utils']
     * @lib/utils/index => ['@lib/utils/index', '@lib/utils']
     */
    const matches: string[] = [externalName];
    if (externalName.endsWith('/index')) {
        matches.push(externalName.replace(/\/index$/, ''));
    }

    /**
     * 匹配的文件路径
     * @example
     * ['./serviceName/src/utils/index', './serviceName/src/utils'] => ['/Users/xxx/serviceName/src/utils/index', '/Users/xxx/serviceName/src/utils']
     */
    const filePaths = matches.reduce<string[]>((acc, item) => {
        if (item.startsWith('./')) {
            const target = path.resolve(
                root,
                item.replace(new RegExp(`^${gezName}\/`), '')
            );
            acc.push(target);
        }
        return acc;
    }, []);

    /**
     * 可能出现的场景：
     * 例如：root:src/square/index.ts
     * 入参：request 可能得值
     * 1. ssr-broker-business/src/square
     * 2. ssr-broker-business/src/square/index
     * 3. 在 test.ts 使用 ./square
     * 4. 在 test.ts 使用 ./square/index
     * issuer
     */
    return (issuer: string | undefined, request: string) => {
        const result = externalValue.import ?? request;
        if (!issuer) return false;
        if (issuer && externalValue.match.test(request)) {
            return result;
        }
        // 以 servername/ 开头的路径 直接进行匹配，命中时直接返回
        if (request.startsWith(`${gezName}\/`)) {
            if (matches.includes(request)) {
                return result;
            }
        }

        if (request.startsWith(`./`)) {
            const index = request.indexOf('?');
            const requestFile =
                index > 0 ? request.substring(2, index) : request;
            const realPath = path.resolve(issuer, '../', request);
            if (requestFile === realPath) {
                return false;
            }
            if (filePaths.includes(realPath)) {
                return result;
            }
        }

        return false;
    };
}
