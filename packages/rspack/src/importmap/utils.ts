import path from 'node:path';

import { type GezModuleConfig } from '@gez/core';
import type { EntryStaticNormalized, ResolveAlias } from '@rspack/core';

interface ImportMapConfig {
    importBase: Record<string, string>;
    targets: Record<string, Record<string, string>>;
    imports: Record<string, string>;
    exposes: string[];
}

export function getImportMapConfig(modules?: GezModuleConfig): ImportMapConfig {
    if (!modules) {
        return {
            importBase: {},
            targets: {},
            imports: {},
            exposes: []
        };
    }
    const { importBase, imports = [], exposes = [] } = modules;
    console.log('@getImportMapConfig', modules);
    const regex = /^(.*?)\/(.*)$/; // 使用正则表达式匹配第一个/符号
    const importConfig = imports.reduce<ImportMapConfig>(
        (acc, item) => {
            const match = item.match(regex);

            if (match) {
                const [, part1, part2] = match;
                const origin = importBase[part1] || importBase['*'] || '';
                const fullPath = `${origin}/${item}`;

                const target = acc.targets[part1];
                if (target) {
                    target[item] = fullPath;
                } else {
                    acc.targets[part1] = {
                        [item]: fullPath
                    };
                }
                acc.imports[item] = fullPath;
            }
            return acc;
        },
        {
            importBase,
            targets: {},
            imports: {},
            exposes
        }
    );
    // const hash = crypto
    //     .createHash('sha256')
    //     .update(result)
    //     .digest('hex');
    // console.log('@hash', hash, result);
    // console.log('@importConfig', importConfig);
    return importConfig;
}

export function getEntryConfig(
    options: {
        root?: string;
        modules?: GezModuleConfig;
    },
    baseConfig: EntryStaticNormalized = {}
): EntryStaticNormalized {
    const { root = '', modules: { exposes = [] } = {} } = options;
    return exposes.reduce<EntryStaticNormalized>((acc, expose) => {
        const exposeName = expose.replace(/^\.\//, '');
        const exposePath = path.resolve(root, exposeName);
        acc[exposeName] = {
            import: [exposePath],
            library: {
                type: 'module'
            }
        };
        return acc;
    }, baseConfig);
}

export function getAlias(
    options: {
        root?: string;
        modules?: GezModuleConfig;
    },
    baseConfig: ResolveAlias = {}
): ResolveAlias {
    const { root = '', modules: { importBase = {} } = {} } = options;
    return Object.keys(importBase).reduce<ResolveAlias>((acc, key) => {
        acc[key] = path.resolve(root, 'node_modules', key);
        return acc;
    }, baseConfig);
}
