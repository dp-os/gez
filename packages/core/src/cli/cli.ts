import path from 'path';
// @ts-expect-error type error
import { tsImport } from 'tsx/esm/api';

import { type App, createApp, getProjectPath, Gez } from '../core';
import { type NodeOptions } from '../node';
const NAMESPACE = 'gez';
enum COMMAND {
    dev = 'dev',
    build = 'build',
    preview = 'preview',
    start = 'start'
}

export function cli() {
    const command = process.argv.slice(2)[0] || '';
    switch (command) {
        case COMMAND.dev:
        case COMMAND.build:
        case COMMAND.preview:
            runDevApp(command);
            break;
        case COMMAND.start:
            runProdApp();
            break;
        default:
            runFile(command);
            break;
    }
}

function defaultCreated() {
    throw new Error("'created' function not set");
}

function defaultCreateDevApp(): App {
    throw new Error("'createDevApp' function not set");
}

export async function runFile(file: string): Promise<Record<string, any>> {
    if (!/\.(js|ts|mjs|cjs)$/.test(file)) return {};
    const module = await tsImport(path.resolve(file), import.meta.url);

    return module;
}

async function runDevApp(command: COMMAND) {
    const module = await tsImport(
        path.resolve('src/entry-node.ts'),
        import.meta.url
    );
    const options: NodeOptions = module.default || {};
    const created = options.created || defaultCreated;
    const createDevApp = options.createDevApp ?? defaultCreateDevApp;

    const gez = new Gez(options);
    const app = await createDevApp(gez);
    gez.app = app;

    switch (command) {
        case COMMAND.dev:
            created(gez);
            break;
        case COMMAND.build:
            await app.build();
            await app.destroy();
            break;
        case COMMAND.preview:
            await app.build();
            await app.destroy();
            runProdApp();
            break;
    }
}

async function runProdApp() {
    const file = getProjectPath(path.resolve(), 'dist/node/entry-node.js');
    import(/* @vite-ignore */ file).then(async (module) => {
        const options: NodeOptions = module.default || {};
        const created = options.created || defaultCreated;
        process.env.NODE_ENV = 'production';

        const gez = new Gez(options);
        gez.app = await createApp(gez);

        created(gez);
    });
}
