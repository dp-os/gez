import type { PackageJson, ParsedModuleConfig } from '@gez/core';
import type {
    Compilation,
    Compiler,
    StatsCompilation,
    StatsModule
} from '@rspack/core';
import { generateIdentifier } from './identifier';

export function packagePlugin(
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
                (assets) => {
                    const stats = compilation.getStats().toJson({
                        all: false,
                        chunks: true,
                        modules: true,
                        ids: true,
                        hash: true,
                        entrypoints: true
                    });
                    const exports = getExports(stats);
                    const hash = stats.hash ?? String(Date.now());
                    const files = Object.keys(assets)
                        .map(transFileName)
                        .filter(
                            (file) => !/.hot-update\.(js|json)$/.test(file)
                        );

                    const packageJson: PackageJson = {
                        name: moduleConfig.name,
                        version: '1.0.0',
                        hash,
                        type: 'module',
                        exports: exports,
                        files,
                        build: getBuildInfo(moduleConfig, stats)
                    };

                    const { RawSource } = compiler.webpack.sources;

                    compilation.emitAsset(
                        'package.json',
                        new RawSource(JSON.stringify(packageJson, null, 4))
                    );
                }
            );
        }
    );
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

export function getExports(stats: StatsCompilation) {
    const entrypoints = stats.entrypoints || {};
    const exports: Record<string, string> = {};
    Object.entries(entrypoints).forEach(([key, value]) => {
        const asset = value.assets?.find((item) => {
            return (
                item.name.endsWith('.js') &&
                item.name.indexOf('.hot-update.') === -1
            );
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
    return exports;
}

function getBuildInfo(config: ParsedModuleConfig, stats: StatsCompilation) {
    const chunkMaps: PackageJson['build'] = {};

    const chunks = stats.chunks ?? [];
    const each = (children?: StatsModule[]) => {
        if (!children) return;
        children.forEach((child) => {
            if (
                child.moduleType?.startsWith('javascript/') &&
                child.nameForCondition &&
                child.chunks?.length === 1
            ) {
                const statsChunk = child.chunks.map((id) => {
                    return chunks.find((chunk) => chunk.id === id);
                })?.[0];
                if (!statsChunk) return;
                const js = statsChunk.files?.find((file) =>
                    file.endsWith('.js')
                );
                if (!js) return;
                const name = generateIdentifier({
                    root: config.root,
                    name: config.name,
                    filePath: child.nameForCondition
                });
                const css =
                    statsChunk.files?.filter((file) => file.endsWith('.css')) ??
                    [];
                const sizes = statsChunk.sizes ?? {};
                chunkMaps[name] = {
                    js,
                    css,
                    resources: statsChunk.auxiliaryFiles ?? [],
                    sizes: {
                        js: sizes?.javascript ?? 0 + sizes.runtime ?? 0,
                        css: sizes.css ?? 0,
                        resource: sizes.asset ?? 0
                    }
                };
            }
            each(child.modules);
        });
    };
    each(stats.modules);
    return chunkMaps;
}
