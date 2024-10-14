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

    const { files, fileList } = readFileDirectory(
        path.resolve(gez.root, 'dist')
    );
    const { zipU8, contenthash } = zipFiles(files);
    write.sync(
        path.resolve(gez.root, `dist/client/zip/${contenthash}.zip`),
        zipU8
    );

    if (dtsExist) {
        const { files: typeFiles } = readFileDirectory(dtsDir);
        const { zipU8: typeZipped } = zipFiles(typeFiles);
        write.sync(
            path.resolve(gez.root, `dist/client/zip/${contenthash}.dts.zip`),
            typeZipped
        );
    }

    const importmapFilePath =
        fileList.find((item) => {
            return (
                item.startsWith('importmap.') &&
                item.endsWith('.js') &&
                item !== 'importmap.js'
            );
        }) || '';

    const manifestJson: ManifestJson = {
        version: contenthash,
        importmapFilePath,
        dts: dtsExist,
        files: fileList
    };
    write.sync(
        path.resolve(gez.root, 'dist/client/zip/manifest.json'),
        JSON.stringify(manifestJson, null, 4)
    );
}
