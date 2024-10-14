import fs from 'node:fs';
import path from 'node:path';
import write from 'write';

import type { Gez } from '../gez';
import type { ManifestJson } from './types';
import { readFileDirectory, zipFiles } from './utils';

/**
 * 构建导入映射（importmap）的函数
 * 该函数用于生成客户端和服务器的导入映射文件，以及相关的压缩文件和清单文件
 * @param gez - 包含项目根目录和模块配置的对象
 * @returns
 */
export function buildImportmap(gez: Gez) {
    if (!gez.moduleConfig) return;
    const { typeDir } = gez.moduleConfig;
    const dtsDir = path.resolve(gez.root, typeDir || '');
    const dtsExist = typeDir ? fs.existsSync(dtsDir) : false;

    const { files: clientFiles } = readFileDirectory(
        path.resolve(gez.root, 'dist/client')
    );
    const { zipU8: clientZipped, contenthash: clientHash } =
        zipFiles(clientFiles);
    write.sync(
        path.resolve(gez.root, `dist/client/server/${clientHash}.zip`),
        clientZipped
    );

    const { files: serverFiles } = readFileDirectory(
        path.resolve(gez.root, 'dist/server')
    );
    const { zipU8: serverZipped, contenthash: serverHash } =
        zipFiles(serverFiles);
    write.sync(
        path.resolve(gez.root, `dist/client/server/${serverHash}.zip`),
        serverZipped
    );

    let dtsHash = '';
    if (dtsExist) {
        const { files: typeFiles } = readFileDirectory(dtsDir);
        const { zipU8: typeZipped, contenthash } = zipFiles(typeFiles);
        dtsHash = contenthash;
        write.sync(
            path.resolve(gez.root, `dist/client/server/${dtsHash}.dts.zip`),
            typeZipped
        );
    }

    const manifestJson: ManifestJson = {
        client: clientHash,
        server: serverHash,
        dts: dtsHash
    };
    write.sync(
        path.resolve(gez.root, 'dist/client/server/manifest.json'),
        JSON.stringify(manifestJson, null, 4)
    );
}
