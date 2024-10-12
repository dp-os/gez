import path from 'node:path';

import type { Gez } from './gez';

export interface ModuleConfig {
    /**
     * 对外导出的文件
     * 例如:
     *   vue
     *   ./src/routes
     *   ./src/[filename]
     */
    exports?: string[];
    /**
     * 设置项目的外部依赖
     * 例如：
     * {
     *  "vue": "ssr-npm/vue"
     * }
     */
    externals?: Record<string, string>;
    /**
     * 导入的模块基本配置
     */
    imports?: Record<string, string | [string, string]>;
}

export interface ParsedModuleConfig {
    name: string;
    /**
     * 对外导出的文件
     */
    exports: Record<string, string>;
    /**
     * 导入的外部服务
     */
    imports: Record<string, { localPath: string; remoteUrl?: string }>;
    /**
     * 外部依赖
     */
    externals: Record<string, { match: RegExp; import?: string }>;
}

export function parseModuleConfig(
    name: string,
    config: ModuleConfig = {}
): ParsedModuleConfig {
    const exports: ParsedModuleConfig['exports'] = {};
    if (config.exports) {
        config.exports.forEach((key) => {
            if (key.startsWith('./')) {
                exports[key.replace(/\.ts$/, '')] = key;
            } else {
                exports[key] = key;
            }
        });
    }
    const imports: ParsedModuleConfig['imports'] = {};
    if (config.imports) {
        const _imports = config.imports;
        Object.keys(config.imports).forEach((key) => {
            const value = _imports[key];
            if (typeof value === 'string') {
                imports[key] = {
                    localPath: value
                };
            } else if (Array.isArray(value)) {
                imports[key] = {
                    localPath: value[0],
                    remoteUrl: value[1]
                };
            }
        });
    }
    const externals: ParsedModuleConfig['externals'] = {};
    if (config.externals) {
        const _externals = config.externals;
        Object.keys(_externals).forEach((key) => {
            externals[key] = {
                match: new RegExp(`/^${_externals[key]}$/`)
            };
        });
    }
    Object.entries(exports).forEach(([key]) => {
        if (key.startsWith('./')) {
            const extName = `${name}/${key.substring(2)}`;
            externals[extName] = {
                match: new RegExp(`^${extName}$`)
            };
        } else {
            externals[key] = {
                match: new RegExp(`^${key}$`),
                import: `${name}/${key}`
            };
        }
    });
    Object.keys(imports).forEach((key) => {
        externals[key] = {
            match: new RegExp(`^${[key]}/`)
        };
    });
    return { name, exports, imports, externals };
}
