import path from 'node:path';

// @ts-expect-error
import { tsImport } from 'tsx/esm/api';

import { COMMAND, Gez, type GezOptions, getProjectPath } from '../core';

export function cli() {
    const command = process.argv.slice(2)[0] || '';
    switch (command) {
        case COMMAND.install:
            runDevApp(command);
            break;
        case COMMAND.dev:
            runDevApp(command);
            break;
        case COMMAND.build:
        case COMMAND.zip:
        case COMMAND.preview:
            process.env.NODE_ENV = 'production';
            runDevApp(command);
            break;
        case COMMAND.start:
            process.env.NODE_ENV = 'production';
            runProdApp();
            break;
        default:
            createMod(command).import();
            break;
    }
}

interface Mod {
    import: () => Promise<Record<string, any>>;
    dispose: () => Promise<void>;
}
export function createMod(file: string): Mod {
    const fullFile = path.resolve(file);
    return {
        async import() {
            return tsImport(fullFile, import.meta.url);
        },
        async dispose() {}
    };
}

async function runDevApp(command: COMMAND) {
    const mod = createMod(path.resolve('src/entry.node.ts'));
    const module = await mod.import();
    const options: GezOptions = module.default || {};

    const gez = new Gez(options);
    await gez.init(command);

    switch (command) {
        case COMMAND.install:
            await gez.install();
            await gez.destroy();
            await mod.dispose();
            break;
        case COMMAND.dev:
            options?.createServer?.(gez);
            break;
        case COMMAND.build:
            await gez.build();
            await gez.destroy();
            await mod.dispose();
            break;
        case COMMAND.zip:
            await gez.zip();
            await gez.destroy();
            await mod.dispose();
            break;
        case COMMAND.preview:
            await gez.build();
            await gez.destroy();
            await mod.dispose();
            await runProdApp();
            break;
    }
}

async function runProdApp() {
    const file = getProjectPath(path.resolve(), 'dist/node/entry.js');
    await import(file).then(async (module) => {
        const options: GezOptions = module.default || {};

        const gez = new Gez(options);
        await gez.init(COMMAND.start);

        options?.createServer?.(gez);
    });
}
