import type { Gez } from '../gez';
import { unzipRemoteFile } from './utils';

import type { ManifestJson } from './types';

export function installImportmap(gez: Gez) {
    Promise.allSettled(
        gez.moduleConfig.imports.map(async (item) => {
            const { localPath, remoteUrl } = item;
            if (remoteUrl) {
                const fullPath = `${remoteUrl}/zip/manifest.json`;

                const res = await fetch(fullPath);
                if (!res.ok || !res.body) return;
                const buffer = Buffer.from(await res.arrayBuffer());
                try {
                    const manifest: ManifestJson = JSON.parse(
                        buffer.toString()
                    );
                    const { dts, version } = manifest;
                    await unzipRemoteFile(
                        `${remoteUrl}/zip/${version}.zip`,
                        localPath
                    );
                    if (dts) {
                        await unzipRemoteFile(
                            `${remoteUrl}/zip/${version}.dts.zip`,
                            localPath
                        );
                    }
                } catch (error) {}
            }
        })
    );
}
