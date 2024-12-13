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

                    const hash = contentHash(code).substring(0, 12);
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
    const urlArr = new URL(document.currentScript.src).pathname.split('/');
    urlArr.pop();
    const baseUrl = urlArr.join('/') + '/';
    Object.entries(importsMap).forEach(([key, value]) => {
        imports[name + '/' + key] =  baseUrl + value;
    });
})(globalThis);
`.trim();
}

function contentHash(text: string) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
}
