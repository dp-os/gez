import type { Gez } from '../gez';
import { unzipRemoteFile } from './utils';

import path from 'node:path';
import type { ZipVersionJson } from './types';

export function installImportmap(gez: Gez) {
    Promise.allSettled(
        gez.moduleConfig.imports.map(async (item) => {
            const { localPath, remoteUrl } = item;
            if (!remoteUrl) {
                return;
            }
            const url = new URL(remoteUrl);
            const res = await fetch(url.href);
            if (!res.ok || !res.body) return;
            const buffer = Buffer.from(await res.arrayBuffer());
            console.log(remoteUrl);
            const manifest: ZipVersionJson = JSON.parse(buffer.toString());

            await Promise.all(
                Object.keys(manifest).map(async (name) => {
                    const version = manifest[name];
                    const arr = url.href.split('/');
                    arr[arr.length - 1] = `${version}.zip`;
                    const zipUrl = arr.join('/');
                    await unzipRemoteFile(
                        zipUrl,
                        path.resolve(localPath, name)
                    );
                })
            );
            console.log('done');
        })
    );
}
