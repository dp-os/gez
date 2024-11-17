import type { Gez } from '@gez/core';
import Arborist from '@npmcli/arborist';
import pacote from 'pacote';

export async function pack(gez: Gez): Promise<boolean> {
    const { packConfig } = gez;

    if (!packConfig.enable) {
        return true;
    }

    const pkgJson = await packConfig.packageJson(
        gez,
        await buildPackageJson(gez)
    );
    gez.writeSync(
        gez.resolvePath('dist/package.json'),
        JSON.stringify(pkgJson, null, 4)
    );

    await packConfig.onBefore(gez, pkgJson);

    const data = await pacote.tarball(gez.resolvePath('dist'), {
        Arborist
    });

    packConfig.outputs.forEach((file) => {
        gez.writeSync(gez.resolvePath('./', file), data);
    });

    await packConfig.onAfter(gez, pkgJson, data);
    return true;
}

async function buildPackageJson(gez: Gez): Promise<Record<string, any>> {
    const [clientJson, serverJson, curJson] = await Promise.all([
        gez.readJsonSync(gez.resolvePath('dist/client/manifest.json')),
        gez.readJsonSync(gez.resolvePath('dist/server/manifest.json')),
        gez.readJsonSync(gez.resolvePath('package.json'))
    ]);
    const dependencies: Record<string, string | undefined> = {
        ...curJson.dependencies,
        ...curJson.devDependencies
    };
    const exports: Record<string, any> = {};
    Object.entries<string>(serverJson.exports).forEach(([name, server]) => {
        const client = clientJson.exports[name];
        if (client) {
            exports[name] = {
                default: `./server/${server.substring(2)}`,
                browser: `./client/${client.substring(2)}`
            };
        } else {
            exports[name] = `./server/${server.substring(2)}`;
        }
    });
    const buildJson: Record<string, any> = {
        name: gez.name,
        version: curJson.version,
        type: 'module',
        dependencies,
        exports
    };
    return buildJson;
}
