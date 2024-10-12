import fs from 'node:fs';
import path from 'node:path';
import symlinkDir from 'symlink-dir';
import type { ParsedModuleConfig } from './module-config';

/**
 * 模块的联合
 * @param root 模块的目录
 * @param moduleConfig 模块的配置
 */
export function moduleLink(root: string, moduleConfig: ParsedModuleConfig) {
    moduleConfig.imports.forEach(({ localPath, name }) => {
        const sourceDir = path.resolve(localPath, 'server');
        const targetDir = path.resolve(root, name);
        symlinkDir.default.sync(sourceDir, targetDir, {
            overwrite: true
        });
    });
}
