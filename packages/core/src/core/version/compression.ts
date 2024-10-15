import crypto from 'node:crypto';
import path from 'node:path';
import write from 'write';
import type { Gez } from '../gez';
import { getPkgHash } from './pkg';
import { compressionDir } from './zip';

/**
 * 压缩
 * @param sourceDir 压缩目录
 * @param outputFilename 压缩的文件名
 */
export function compression(gez: Gez) {
    const outputDir = path.resolve(
        gez.getProjectPath('dist/client'),
        'versions'
    );
    const list = ['client', 'server'];
    const versionJson: Record<string, string> = {};
    list.forEach((name) => {
        const root = path.resolve(gez.getProjectPath('dist'), name);
        const packageFile = path.resolve(root, 'package.json');
        const hash = getPkgHash(packageFile);
        if (!hash) {
            throw new Error(
                `'${root}' hash does not exist, compression failed`
            );
        }
        const filename = `${hash}.zip`;
        compressionDir(root, path.resolve(outputDir, filename));
        versionJson[name] = hash;
    });

    const versionJsonText = JSON.stringify(versionJson, null, 4);
    const writeJson = (version: string) => {
        const filename = path.resolve(outputDir, `${version}.json`);
        write.sync(path.resolve(gez.root, filename), versionJsonText);
    };
    writeJson('latest');
    writeJson(contentHash(JSON.stringify(versionJsonText)));
    console.log(
        `Compression completed, See detail in '${path.relative(process.cwd(), outputDir)}'`
    );
}

function contentHash(text: string) {
    const hash = crypto.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
}
