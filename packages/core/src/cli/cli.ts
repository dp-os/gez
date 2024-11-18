import path from 'node:path';

import { COMMAND, Gez, type GezOptions } from '../gez';
import { resolvePath } from '../resolve-path';

export function cli() {
    const command = process.argv.slice(2)[0] || '';
    switch (command) {
        case COMMAND.dev:
            runDevApp(command);
            break;
        case COMMAND.build:
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
    return import(path.resolve(file));
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
        case COMMAND.dev:
            options?.createServer?.(gez);
            break;
        case COMMAND.build:
            exit(await gez.build());
            exit(await gez.destroy());
            exit(await postCompileProdHook(gez));
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
    return gez._createServer(gez);
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
        await gez._postCompileProdHook?.(gez);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}
