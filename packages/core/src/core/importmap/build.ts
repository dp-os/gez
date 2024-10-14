import path from 'node:path';
import write from 'write';

import type { Gez } from '../gez';
import type { ZipManifestJson } from './types';
import { zipDir } from './utils';

/**
 * 构建导入映射（importmap）的函数
 * 该函数用于生成客户端和服务器的导入映射文件，以及相关的压缩文件和清单文件
 * @param gez - 包含项目根目录和模块配置的对象
 * @returns
 */
export function buildImportmap(gez: Gez) {
    if (!gez.moduleConfig) return;

    const { contenthash: clientHash } = zipDir(
        path.resolve(gez.root, 'dist/client'),
        path.resolve(gez.root, `dist/client/server/[hash].zip`)
    );
    const { contenthash: serverHash } = zipDir(
        path.resolve(gez.root, 'dist/server'),
        path.resolve(gez.root, `dist/client/server/[hash].zip`)
    );

    const manifestJson: ZipManifestJson = {
        client: clientHash,
        server: serverHash
    };
    write.sync(
        path.resolve(gez.root, 'dist/client/server/manifest.json'),
        JSON.stringify(manifestJson, null, 4)
    );
}
