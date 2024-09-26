import {
    type Compilation,
    type Compiler,
    rspack,
    type RspackPluginInstance
} from '@rspack/core';

/**
 * importmap 插件，用于生成 importmap 相关文件
 */
export class ImportmapPlugin implements RspackPluginInstance {
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
                        const { RawSource } = compiler.webpack.sources;

                        const importmapJs = `
((global) => {
    const name = "${stats.name}";
    const files = ${JSON.stringify(files)};
    const importmapKey = '__importmap__';
    const importmap = global[importmapKey] = global[importmapKey] || {};
    const imports = importmap.imports = importmap.imports || {};
    files.forEach(item => {
        imports[name + "/" + item.name] = "/" + name + "/" + item.file;
    });
})(globalThis);
`.trim();
                        compilation.emitAsset(
                            'importmap.js',
                            new RawSource(importmapJs)
                        );

                        const importmapJson = JSON.stringify(
                            {
                                imports: files.reduce<Record<string, string>>(
                                    (obj, item) => {
                                        if (item) {
                                            const { name, file } = item;
                                            const key = `${stats.name}/${name}`;
                                            const value = `/${stats.name}/${file}`;
                                            obj[key] = value;
                                        }
                                        return obj;
                                    },
                                    {}
                                )
                            },
                            null,
                            4
                        );
                        compilation.emitAsset(
                            'importmap.json',
                            new RawSource(importmapJson)
                        );
                    }
                );
            }
        );
    }
}
