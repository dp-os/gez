import fs from 'node:fs';
import { isBuiltin } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import IM from '@import-maps/resolve';
import type { ImportMap } from './types';

/**
 * 创建一个使用 vm 实现的 importmap 的 import 函数，可以创建多次来实现热更新效果，适合开发使用。
 */
export function createVmImport(baseURL: URL, importMap: ImportMap = {}) {
    const parsedImportMap = IM.parse(importMap, baseURL);
    async function moduleLinker(
        specifier: string,
        parent: string,
        context: vm.Context,
        cache = new Map<string, Promise<vm.SourceTextModule>>()
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
        const result = IM.resolve(specifier, parsedImportMap, new URL(parent));

        let filename: string;
        if (result.matched && result.resolvedImport) {
            filename = result.resolvedImport.href;
        } else {
            filename = import.meta.resolve(specifier, parent);
        }
        const url = new URL(filename);
        const readFilename = url.pathname;
        let module = cache.get(readFilename);
        if (module) {
            return module;
        }
        const dirname = path.dirname(filename);
        const build = async (): Promise<vm.SourceTextModule> => {
            const text = fs.readFileSync(readFilename, 'utf-8');
            const module = new vm.SourceTextModule(text, {
                initializeImportMeta: (meta) => {
                    meta.filename = filename;
                    meta.dirname = dirname;
                    meta.resolve = (
                        specifier: string,
                        parent: string | URL = url
                    ) => {
                        return import.meta.resolve(specifier, parent);
                    };
                    meta.url = url.toString();
                },
                identifier: specifier,
                context: context,
                // @ts-ignore
                importModuleDynamically: (specifier, referrer) => {
                    return moduleLinker(
                        specifier,
                        filename,
                        // @ts-ignore
                        referrer.context,
                        cache
                    );
                }
            });
            await module.link((specifier: string, referrer) => {
                return moduleLinker(
                    specifier,
                    filename,
                    referrer.context,
                    cache
                );
            });
            await module.evaluate();
            return module;
        };
        module = build();
        cache.set(readFilename, module);
        return module;
    }
    return async (
        specifier: string,
        parent: string,
        sandbox?: vm.Context,
        options?: vm.CreateContextOptions
    ) => {
        const context = vm.createContext(sandbox, options);
        const module = await moduleLinker(specifier, parent, context);

        return module.namespace as Record<string, any>;
    };
}
