import type { Gez } from '../gez';
import { unzipRemoteFile } from './utils';

import type { ManifestJson } from './types';

export function installImportmap(gez: Gez) {
    Promise.allSettled(
        gez.moduleConfig.imports.map(async (item) => {
            const { localPath, remoteUrl } = item;
            if (remoteUrl) {
                const fullPath = `${remoteUrl}/server/manifest.json`;

                const res = await fetch(fullPath);
                if (!res.ok || !res.body) return;
                const buffer = Buffer.from(await res.arrayBuffer());
                console.log(fullPath);
                try {
                    const manifest: ManifestJson = JSON.parse(
                        buffer.toString()
                    );
                    const { server } = manifest;
                    await unzipRemoteFile(
                        `${remoteUrl}/server/${server}.zip`,
                        localPath
                    );
                } catch (error) {}
            }
        })
    );
}
