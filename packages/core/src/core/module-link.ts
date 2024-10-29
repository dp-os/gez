import path from 'node:path';
import symlinkDir from 'symlink-dir';
import type { ParsedModuleConfig } from './module-config';

/**
 * 模块的联合
 * @param root 模块的目录
 * @param moduleConfig 模块的配置
 * todo 下载时检查 version，无更新不下载
 */
export function moduleLink(root: string, moduleConfig: ParsedModuleConfig) {
    const localPathList = [
        root,
        ...moduleConfig.imports.map(({ localPath }) => localPath)
    ];
    const maxSamePath = getMaxSamePath(localPathList);

    moduleConfig.imports.forEach(({ localPath, name }) => {
        const sourceDir = path.resolve(localPath, 'server');
        const targetDir = path.resolve(maxSamePath, 'node_modules', name);
        symlinkDir.default.sync(sourceDir, targetDir, {
            overwrite: true
        });
    });
}

/**
 * 获取路径列表中的最大相同路径
 * @param pathList - 路径列表
 * @returns 最大相同路径
 */
function getMaxSamePath(pathList: string[]): string {
    let maxSamePath = '';
    if (pathList.length === 0) {
        return maxSamePath;
    }
    const charList = pathList[0].split('/');
    for (let i = 0; i < charList.length; i++) {
        const char = charList[i];
        const targetPath = maxSamePath + char;
        const isSame = pathList.every((fullPath) => {
            if (
                fullPath === targetPath ||
                fullPath.startsWith(`${targetPath}/`)
            ) {
                return true;
            }
            return false;
        });
        if (isSame) {
            maxSamePath = `${maxSamePath}${char}/`;
        } else {
            break;
        }
    }
    return maxSamePath;
}
