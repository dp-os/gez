import fs from 'node:fs';
import path from 'node:path';

import crypto from 'crypto-js';
import * as fflate from 'fflate';
import find from 'find';
import write from 'write';

/**
 * 压缩指定目录下的所有文件到一个zip文件中，并返回压缩文件的内容哈希和文件列表。
 *
 * @param dir - 要压缩的目录路径。
 * @param target - 压缩文件的目标路径。 支持[hash]占位符,例: src/index.[hash].js
 * @returns 一个对象，包含压缩文件的内容哈希和文件列表。
 */
export function zipDir(
    dir: string,
    target: string
): {
    contenthash: string;
    fileList: string[];
} {
    const files: Record<string, any> = {};
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory) {
        return {
            contenthash: '',
            fileList: []
        };
    }
    find.fileSync(dir).forEach((filename: string) => {
        const text = fs.readFileSync(filename);
        files[path.relative(dir, filename)] = text;
    });
    const zipU8 = fflate.zipSync(files);
    const contenthash = crypto.MD5(zipU8.toString()).toString().slice(0, 8);
    write.sync(target.replace('[hash]', contenthash), zipU8);

    return {
        contenthash,
        fileList: Object.keys(files)
    };
}

/**
 * 异步获取并解压 ZIP 文件到指定目录
 * @param url - 要获取的 ZIP 文件的 URL
 * @param dir - 要解压到的目标目录
 * @returns
 */
export async function unzipRemoteFile(url: string, dir: string) {
    const res = await fetch(url);
    if (!res.ok || !res.body) return;
    const buffer = new Uint8Array(await res.arrayBuffer());

    try {
        let files: fflate.Unzipped = {};
        try {
            files = fflate.unzipSync(buffer);
        } catch (e) {}
        Object.keys(files).forEach((name) => {
            write.sync(path.resolve(dir, name), files[name]);
        });
    } catch (e) {}
}
