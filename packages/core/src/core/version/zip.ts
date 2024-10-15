import fs from 'node:fs';
import path from 'node:path';
import * as fflate from 'fflate';
import find from 'find';
import write from 'write';
/**
 * 压缩指定目录
 * @param root 压缩的目录
 * @param outputFilename 输出的文件名
 */
export function compressionDir(root: string, outputFilename: string) {
    const data: Record<string, any> = {};
    find.fileSync(root).forEach((filename: string) => {
        data[path.relative(root, filename)] = fs.readFileSync(filename);
    });
    const zipU8 = fflate.zipSync(data);
    write.sync(outputFilename, zipU8);
}
/**
 * 解压的目录
 * @param root 解压到的目录
 */
export function decompressionDir(root: string, data: ArrayBuffer) {
    const buffer = new Uint8Array(data);
    const files: fflate.Unzipped = fflate.unzipSync(buffer);
    Object.keys(files).forEach((name) => {
        write.sync(path.resolve(root, name), files[name]);
    });
}
