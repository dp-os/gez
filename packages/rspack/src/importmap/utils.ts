import path from 'node:path';

import { type GezModuleConfig } from '@gez/core';
import type { EntryStaticNormalized, RspackOptions } from '@rspack/core';

export function getImportConfig(modules: GezModuleConfig) {
    const { importBase, imports = [], exposes = [] } = modules;
    const regex = /^(.*?)\/(.*)$/; // 使用正则表达式匹配第一个/符号
    const importConfig = imports.reduce<{
        targets: Record<string, Record<string, string>>;
        imports: Record<string, string>;
    }>(
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
            targets: {},
            imports: {}
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

// type Config = RspackOptions['entry'];
export function getEntryConfig(
    options: {
        root?: string;
        modules?: GezModuleConfig;
    },
    baseConfig: EntryStaticNormalized = {}
): EntryStaticNormalized {
    const { root = '', modules: { exposes = [] } = {} } = options;
    return exposes.reduce<EntryStaticNormalized>((acc, expose) => {
        console.log('@expose', [path.resolve(root, expose)]);
        acc[expose] = {
            import: [path.resolve(root, expose)],
            library: {
                type: 'module'
            }
        };
        return acc;
    }, baseConfig);
}
