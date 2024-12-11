import crypto from 'node:crypto';
import type { Gez } from '@gez/core';
import Arborist from '@npmcli/arborist';
import pacote from 'pacote';

export async function pack(gez: Gez): Promise<boolean> {
    const { packConfig } = gez;

    const pkgJson = await packConfig.packageJson(
        gez,
        await buildPackageJson(gez)
    );
    gez.writeSync(
        gez.resolvePath('dist/package.json'),
        JSON.stringify(pkgJson, null, 4)
    );

    if (!packConfig.enable) {
        return true;
    }

    await packConfig.onBefore(gez, pkgJson);

    const data = await pacote.tarball(gez.resolvePath('dist'), {
        Arborist
    });
    const hash = contentHash(data);
    packConfig.outputs.forEach((file) => {
        const tgz = gez.resolvePath('./', file);
        const txt = tgz.replace(/\.tgz$/, '.txt');
        gez.writeSync(tgz, data);
        gez.writeSync(txt, hash);
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
    const exports: Record<string, any> = {
        ...curJson?.exports,
        './src/entry.client': `./client/${clientJson.exports['./src/entry.client'].substring(2)}`
    };
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
        ...curJson,
        exports
    };
    return buildJson;
}

function contentHash(buffer: Buffer, algorithm = 'sha256') {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return `${algorithm}-${hash.digest('hex')}`;
}
