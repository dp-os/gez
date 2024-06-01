import path from 'node:path';

// @ts-expect-error type error
import { register } from 'tsx/esm/api';

import { COMMAND, getProjectPath, Gez } from '../core';
import { type NodeOptions } from '../node';

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
            createMod(command).import();
            break;
    }
}

function defaultCreated() {
    throw new Error("'created' function not set");
}

interface Mod {
    import: () => Promise<Record<string, any>>;
    reload: () => Promise<void>;
    dispose: () => Promise<void>;
}
export function createMod(file: string): Mod {
    let _api: any = null;
    let disposed = false;
    const getApi = (): any => {
        if (disposed) {
            throw new Error(`The '${file}' module has been disposed`);
        }
        if (_api) {
            return _api;
        }
        _api = register({
            namespace: Date.now().toString()
        }) as Mod;
        return _api;
    };
    const fullFile = path.resolve(file);

    return {
        async import() {
            return getApi().import(fullFile, import.meta.url);
        },
        async reload() {
            await getApi().unregister();
            _api = null;
        },
        async dispose() {
            await getApi().unregister();
            _api = null;
            disposed = true;
        }
    };
}

async function runDevApp(command: COMMAND) {
    const mod = createMod(path.resolve('src/entry-node.ts'));
    const module = await mod.import();
    const options: NodeOptions = module.default || {};
    const created = options.created || defaultCreated;

    const gez = new Gez(options);
    await gez.init(command);

    switch (command) {
        case COMMAND.dev:
            created(gez);
            break;
        case COMMAND.build:
            await gez.build();
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
    const file = getProjectPath(path.resolve(), 'dist/node/entry-node.js');
    await import(/* @vite-ignore */ file).then(async (module) => {
        const options: NodeOptions = module.default || {};
        const created = options.created || defaultCreated;

        const gez = new Gez(options);
        await gez.init(COMMAND.start);

        created(gez);
    });
}
