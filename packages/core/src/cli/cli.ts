import path from 'node:path';

import { COMMAND, Gez, type GezOptions, getProjectPath } from '../core';

export function cli() {
    const command = process.argv.slice(2)[0] || '';
    switch (command) {
        case COMMAND.install:
            process.env.NODE_ENV = 'production';
            runDevApp(command);
            break;
        case COMMAND.dev:
            runDevApp(command);
            break;
        case COMMAND.build:
        case COMMAND.release:
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
            exit(await gez.install());
            exit(await gez.destroy());
            break;
        case COMMAND.dev:
            options?.createServer?.(gez);
            break;
        case COMMAND.build:
            exit(await gez.build());
            exit(await gez.destroy());
            exit(await postCompileProdHook(gez));
            break;
        case COMMAND.release:
            exit(await gez.release());
            exit(await gez.destroy());
            break;
        case COMMAND.preview:
            exit(await gez.build());
            exit(await gez.destroy());
            await runProdApp();
            break;
    }
}

async function runProdApp() {
    const gez = await getProdGez();
    return gez.createServer(gez);
}

async function getProdGez(): Promise<Gez> {
    const file = getProjectPath(path.resolve(), 'dist/node/entry.js');
    return import(file).then(async (module) => {
        const options: GezOptions = module.default || {};

        const gez = new Gez(options);
        await gez.init(COMMAND.start);
        return gez;
    });
}

async function postCompileProdHook(gez: Gez): Promise<boolean> {
    if (!gez.postCompileProdHook) {
        return true;
    }
    gez = await getProdGez();
    try {
        await gez.postCompileProdHook?.(gez);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}
