import path from 'node:path';

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
            tsImport(command);
            break;
    }
}

async function tsImport(file: string): Promise<Record<string, any>> {
    // @ts-ignore
    const result = await import('tsx/esm/api');
    return result.tsImport(path.resolve(file), import.meta.url);
}

async function runDevApp(command: COMMAND) {
    const module = await tsImport(path.resolve('src/entry.node.ts'));
    const options: GezOptions = module.default || {};

    const gez = new Gez(options);
    await gez.init(command);
    const exit = (ok: boolean) => {
        if (!ok) {
            process.exit(7);
        }
    };
    switch (command) {
        case COMMAND.install:
            await gez.install();
            await gez.destroy();
            break;
        case COMMAND.dev:
            options?.createServer?.(gez);
            break;
        case COMMAND.build:
            exit(await gez.build());
            await gez.destroy();
            break;
        case COMMAND.zip:
            await gez.zip();
            await gez.destroy();
            break;
        case COMMAND.preview:
            exit(await gez.build());
            await gez.destroy();
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
