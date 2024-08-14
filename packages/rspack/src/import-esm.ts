import fs from 'node:fs';
import { isBuiltin } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    createContext,
    type Module,
    type ModuleLinker,
    SourceTextModule,
    SyntheticModule
} from 'node:vm';

const ROOT_MODULE = '__root_module__';

const link: ModuleLinker = async (
    specifier: string,
    referencingModule: Module
) => {
    // Node.js native module
    const isNative = isBuiltin(specifier);
    // node_modules
    const isNodeModules =
        !isNative && !specifier.startsWith('./') && !specifier.startsWith('/');
    if (isNative || isNodeModules) {
        const nodeModule = await import(specifier);
        const keys = Object.keys(nodeModule);
        const module = new SyntheticModule(
            keys,
            function () {
                keys.forEach((key) => {
                    this.setExport(key, nodeModule[key]);
                });
            },
            {
                identifier: specifier,
                context: referencingModule.context
            }
        );
        await module.link(link);
        await module.evaluate();
        return module;
    } else {
        const text = fs.readFileSync(specifier, 'utf-8');
        const module = new SourceTextModule(text, {
            initializeImportMeta,
            identifier: specifier,
            context: referencingModule.context
            // importModuleDynamically
        });
        await module.link(link);
        await module.evaluate();

        return module;
    }
};

export async function importEsm(identifier: string): Promise<any> {
    const context = createContext({
        console,
        process,
        [ROOT_MODULE]: {}
    });
    const module = new SourceTextModule(
        `import * as root from '${identifier}';
        ${ROOT_MODULE} = root;`,
        {
            context
        }
    );
    await module.link(link);
    await module.evaluate();
    return context[ROOT_MODULE];
}

function initializeImportMeta(meta: ImportMeta, module: SourceTextModule) {
    meta.filename = import.meta.resolve(module.identifier, import.meta.url);
    meta.dirname = path.dirname(meta.filename);
    meta.resolve = import.meta.resolve;
    meta.url = fileURLToPath(meta.filename);
}
