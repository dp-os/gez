import path from 'node:path';
import write from 'write';

import type { Gez } from '../gez';
import type { ZipVersionJson } from './types';
import { contentHash, zipDir } from './utils';

/**
 * 构建导入映射（importmap）的函数
 * 该函数用于生成客户端和服务器的导入映射文件，以及相关的压缩文件和清单文件
 * @param gez - 包含项目根目录和模块配置的对象
 * @returns
 */
export function buildImportmap(gez: Gez) {
    const versionJson: ZipVersionJson = {};
    const list: string[] = ['client', 'server'];

    list.forEach((name) => {
        const { contenthash } = zipDir(
            path.resolve(gez.root, `dist/${name}`),
            path.resolve(gez.root, `dist/client/versions/[hash].zip`)
        );
        versionJson[name] = contenthash;
    });
    const versionJsonText = JSON.stringify(versionJson, null, 4);
    const writeJson = (version: string) => {
        const filename = `dist/client/versions/${version}.json`;
        write.sync(path.resolve(gez.root, filename), versionJsonText);
        console.log(`build zip: created ${filename}`);
    };
    writeJson('latest');
    writeJson(contentHash(JSON.stringify(versionJsonText)));
}
