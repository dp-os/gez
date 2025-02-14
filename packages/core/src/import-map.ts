import path from 'node:path';

import { pathWithoutIndex } from './path-without-index';

import type { ImportMap, SpecifierMap } from '@gez/import';
import type { AppBuildTarget } from './gez';
import type { ManifestJson } from './manifest-json';
import type { ParsedModuleConfig } from './module-config';

/**
 * 获取导入映射对象
 */
export async function getImportMap(
    target: AppBuildTarget,
    withoutIndex: boolean,
    manifestList: ManifestJson[] | Promise<readonly ManifestJson[]>,
    moduleConfig: ParsedModuleConfig
): Promise<ImportMap> {
    const imports: SpecifierMap = {};
    const manifests = await manifestList;
    if (target === 'client') {
        for (const manifest of manifests) {
            for (const [name, value] of Object.entries(manifest.exports)) {
                imports[`${manifest.name}/${name}`] =
                    `/${manifest.name}/${value}`;
            }
        }
    } else {
        // 转成map，方便O1查找
        const cfgImports = moduleConfig.imports.reduce((obj, item) => {
            obj[item.name] = item;
            return obj;
        }, {});
        for (const manifest of manifests) {
            const importItem = cfgImports[manifest.name];
            if (!importItem) {
                throw new Error(
                    `'${manifest.name}' service did not find module config`
                );
            }
            for (const [name, value] of Object.entries(manifest.exports)) {
                imports[`${manifest.name}/${name}`] = path.resolve(
                    importItem.localPath,
                    'server',
                    value
                );
            }
        }
    }
    withoutIndex && pathWithoutIndex(imports);
    return { imports };
}
