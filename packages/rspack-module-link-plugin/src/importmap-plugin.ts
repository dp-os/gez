import crypto from 'node:crypto';
import type { ParsedModuleConfig } from '@gez/core';
import type { Compilation, Compiler } from '@rspack/core';
import { getExports } from './package-plugin';

export function importmapPlugin(
    moduleConfig: ParsedModuleConfig,
    compiler: Compiler
) {
    compiler.hooks.thisCompilation.tap(
        'importmap-plugin',
        (compilation: Compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: 'importmap-plugin',
                    stage: compiler.rspack.Compilation
                        .PROCESS_ASSETS_STAGE_ADDITIONAL
                },
                () => {
                    const stats = compilation.getStats().toJson({
                        all: false,
                        entrypoints: true
                    });
                    const exports = getExports(stats);

                    const { RawSource } = compiler.rspack.sources;
                    const code = toImportmapJsCode(moduleConfig.name, exports);

                    const hash = contentHash(code).substring(0, 8);
                    const importmapHash = `importmap.${hash}.final.js`;
                    const isWeb = compilation.options.target === 'web';

                    if (isWeb) {
                        compilation.emitAsset(
                            'importmap.js',
                            new RawSource(code)
                        );
                        compilation.emitAsset(
                            importmapHash,
                            new RawSource(code)
                        );
                    }
                }
            );
        }
    );
}

function toImportmapJsCode(name: string, imports: Record<string, string>) {
    return `
;((global) => {
    const name = '${name}';
    const importsMap = ${JSON.stringify(imports)};
    const importmapKey = '__importmap__';
    const importmap = global[importmapKey] = global[importmapKey] || {};
    const imports = importmap.imports = importmap.imports || {};
    const arr = new URL(document.currentScript.src).pathname.split('/' + name + '/');
    const joinName = (value) => {
        return name + value.substring(1);
    }
    Object.entries(importsMap).forEach(([key, value]) => {
        imports[joinName(key)] = arr[0] + '/' + joinName(value);
    });
})(globalThis);
`.trim();
}

/**
 * 生成内容的hash值
 * @param text 内容
 */
export function contentHash(text: string) {
    const hash = crypto.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
}
