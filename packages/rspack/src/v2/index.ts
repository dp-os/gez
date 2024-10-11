import type { ParsedModuleConfig } from '@gez/core';
import {
    type Assets,
    type Compilation,
    type Compiler,
    type EntryStaticNormalized,
    type Externals,
    type RspackPluginInstance,
    // type ResolveAlias,
    rspack
} from '@rspack/core';

export interface ImportmapData {
    version: string;
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
        this.options = options;
    }
    public apply(compiler: Compiler) {
        this.applyExports(compiler);
        this.applyExternals(compiler);
    }

    public applyExports(compiler: Compiler) {
        const _entry = compiler.options.entry;
        const wrapEntry =
            typeof _entry === 'function' ? _entry : async () => _entry;
        const options = this.options.exports;
        compiler.options.entry = async () => {
            const result = await wrapEntry();
            Object.entries(options).forEach(([key, value]) => {
                const name = key;
                result[name] = {
                    import: [value],
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
}
