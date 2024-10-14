import fs from 'node:fs';
import path from 'node:path';

import crypto from 'crypto-js';
import * as fflate from 'fflate';
import find from 'find';
import write from 'write';

/**
 * 读取指定目录下的所有文件，并返回一个包含文件内容和文件名列表的对象。
 *
 * @param dir - 要读取的目录路径。
 * @returns 一个包含文件内容和文件名列表的对象。
 */
export function readFileDirectory(dir: string): {
    files: Record<string, any>;
    fileList: string[];
} {
    const files: Record<string, any> = {};
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory) {
        return {
            files: {},
            fileList: []
        };
    }
    find.fileSync(dir).forEach((filename: string) => {
        const text = fs.readFileSync(filename);
        files[path.relative(dir, filename)] = text;
    });
    return {
        files,
        fileList: Object.keys(files)
    };
}

/**
 * 将文件对象压缩成zip文件，并计算其内容的哈希值。
 *
 * @param files - 要压缩的文件对象。
 * @returns 一个包含压缩文件和内容哈希值的对象。
 */
export function zipFiles(files: Record<string, any>) {
    const zipU8 = fflate.zipSync(files);
    const contenthash = crypto.MD5(zipU8.toString()).toString().slice(0, 8);
    return {
        zipU8,
        contenthash
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
