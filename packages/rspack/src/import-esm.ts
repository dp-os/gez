import fs from 'node:fs';
import { isBuiltin } from 'node:module';
import path from 'node:path';
import {
    type Context,
    SourceTextModule,
    SyntheticModule,
    createContext
} from 'node:vm';
/**
 *
 * @param {string} specifier import 的模块名称
 * @param {string|URL} parent 将 import.meta.url 传入
 * @returns
 */
export async function importEsmInactive(specifier: string, parent: string) {
    const context = createContext({
        console
    });
    const module = await moduleLinker(specifier, parent, context);

    return module.namespace;
}

async function moduleLinker(
    specifier: string,
    parent: string,
    context: Context
) {
    if (isBuiltin(specifier)) {
        const nodeModule = await import(specifier);
        const keys = Object.keys(nodeModule);
        const module = new SyntheticModule(
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
    const module = new SourceTextModule(text, {
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
        importModuleDynamically: (specifier, referrer) => {
            // @ts-ignore
            return moduleLinker(specifier, filename, referrer.context);
        }
    });
    await module.link((specifier, referrer) => {
        return moduleLinker(specifier, filename, referrer.context);
    });
    await module.evaluate();
    return module;
}
