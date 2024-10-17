import fs from 'node:fs';
import { isBuiltin } from 'node:module';
import path from 'node:path';
import * as vm from 'node:vm';

/**
 * 导入 ESM 模块，每次都是全新的上下文
 * 需要启用：node --experimental-vm-modules --experimental-import-meta-resolve
 * @param specifier 模块的名称
 * @param parent 将使用模块的 import.meta.url 传入
 * @param sandbox 透传给 node:vm createContext(sandbox)
 * @param options 透传给 node:vm createContext(sandbox, options)
 * @returns
 */
export async function import$(
    specifier: string,
    parent: string,
    sandbox?: vm.Context,
    options?: vm.CreateContextOptions
) {
    const context = vm.createContext(sandbox, options);
    const module = await moduleLinker(specifier, parent, context);

    return module.namespace as Record<string, any>;
}

async function moduleLinker(
    specifier: string,
    parent: string,
    context: vm.Context
) {
    if (isBuiltin(specifier)) {
        const nodeModule = await import(specifier);
        const keys = Object.keys(nodeModule);
        const module = new vm.SyntheticModule(
            keys,
            function evaluateCallback() {
                keys.forEach((key) => {
                    this.setExport(key, nodeModule[key]);
                });
            },
            {
                identifier: specifier,
                context: context
            }
        );
        await module.link(() => {
            throw new TypeError(`Native modules should not be linked`);
        });
        await module.evaluate();
        return module;
    }
    const filename = import.meta.resolve(specifier, parent);
    const dirname = path.dirname(filename);
    const url = new URL(import.meta.resolve(specifier, parent));
    const text = fs.readFileSync(url.pathname, 'utf-8');
    const module: vm.SourceTextModule = new vm.SourceTextModule(text, {
        initializeImportMeta: (meta) => {
            meta.filename = filename;
            meta.dirname = dirname;
            meta.resolve = (specifier: string, parent: string | URL = url) => {
                return import.meta.resolve(specifier, parent);
            };
            meta.url = url.toString();
        },
        identifier: specifier,
        context: context,
        // @ts-ignore
        importModuleDynamically: (specifier, referrer) => {
            // @ts-ignore
            return moduleLinker(specifier, filename, referrer.context);
        }
    });
    await module.link((specifier: string, referrer) => {
        return moduleLinker(specifier, filename, referrer.context);
    });
    await module.evaluate();
    return module;
}
