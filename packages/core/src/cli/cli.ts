import path from 'node:path';

import { COMMAND, Gez, type GezOptions } from '../gez';
import { resolvePath } from '../resolve-path';

export async function cli(command: string) {
    switch (command) {
        case COMMAND.dev:
            await runDevApp(COMMAND.dev);
            break;
        case COMMAND.build:
            process.env.NODE_ENV = 'production';
            await runDevApp(COMMAND.build);
            break;
        case COMMAND.preview:
            process.env.NODE_ENV = 'production';
            await runDevApp(COMMAND.build);
            await runProdApp();
            break;
        case COMMAND.start:
            process.env.NODE_ENV = 'production';
            await runProdApp();
            break;
        default:
            await tsImport(command);
            break;
    }
}

async function tsImport(file: string): Promise<Record<string, any>> {
    return import(path.resolve(file));
}

async function runDevApp(command: COMMAND): Promise<void> {
    const module = await tsImport(path.resolve('src/entry.node.ts'));

    const gez = new Gez(module.default);
    await gez.init(command);
    const exit = (ok: boolean) => {
        if (!ok) {
            process.exit(7);
        }
    };
    switch (command) {
        case COMMAND.dev:
            await gez.createServer(gez);
            break;
        case COMMAND.build:
            exit(await gez.build());
            exit(await gez.destroy());
            exit(await postCompileProdHook(gez));
            break;
    }
}

async function runProdApp() {
    const gez = await getProdGez();
    return gez.createServer(gez);
}

async function getProdGez(): Promise<Gez> {
    const file = resolvePath(process.cwd(), 'dist/node/src/entry.node.js');
    return import(file).then(async (module) => {
        const options: GezOptions = module.default ?? {};

        const gez = new Gez(options);
        await gez.init(COMMAND.start);
        return gez;
    });
}

async function postCompileProdHook(gez: Gez): Promise<boolean> {
    gez = await getProdGez();
    try {
        await gez.postCompileProdHook(gez);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}
