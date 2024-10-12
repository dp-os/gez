import path from 'node:path';

import type { Gez } from './gez';

export interface ModuleConfig {
    /**
     * 对外导出的文件
     * 必须以 npm: 或 src: 开头
     * npm:开头代表 node_modules 的依赖
     * src:开头代表项目内src目录下的文件
     * 例如:
     *   npm:vue
     *   src:routes
     *   src:[filename]
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
    exports: {
        /**
         * npm:*
         * src:*
         * src:routes/index.ts
         */
        name: string;
        type: 'npm' | 'src';
        /**
         * ssr-demo/npm/vue
         * ssr-demo/src/routes
         * ssr-demo/src/routes/index
         */
        importName: string;
        /**
         * ./npm/vue
         * ./src/routes
         */
        exportName: string;
        /**
         * vue
         * ./src/routes.ts
         */
        exportPath: string;
        /**
         * vue
         * ssr-demo/src/routes/index
         */
        externalName: string;
    }[];
    /**
     * 导入的外部服务
     */
    imports: {
        /**
         * 外部服务名称
         */
        name: string;
        /**
         * 本地路径
         * 用于读取依赖 和 存放远程下载的依赖
         */
        localPath: string;
        /**
         * 远程路径
         * 用于下载远程依赖
         */
        remoteUrl?: string;
    }[];
    /**
     * 外部依赖
     */
    externals: Record<string, { match: RegExp; import?: string }>;
}

export function parseModuleConfig(
    name: string,
    config: ModuleConfig = {}
): ParsedModuleConfig {
    const exports: ParsedModuleConfig['exports'] = [];
    if (config.exports) {
        config.exports.forEach((key) => {
            if (key.startsWith('npm:')) {
                const exportName = key.replace(/^npm:/, '');

                exports.push({
                    name: key,
                    type: 'npm',
                    importName: `${name}/npm/${exportName}`,
                    exportName: `./npm/${exportName}`,
                    exportPath: exportName,
                    externalName: exportName
                });
            } else if (key.startsWith('src:')) {
                const exportName = key.replace(/^src:/, '');

                const exportNameNoSuffix = exportName.replace(/\.(ts|js)$/, '');

                exports.push({
                    name: key,
                    type: 'src',
                    importName: `${name}/src/${exportNameNoSuffix}`,
                    exportName: `./src/${exportNameNoSuffix}`,
                    exportPath: `./src/${exportName}`,
                    externalName: `${name}/src/${exportNameNoSuffix}`
                });
            }
        });
    }
    const imports: ParsedModuleConfig['imports'] = [];
    if (config.imports) {
        const _imports = config.imports;
        Object.keys(config.imports).forEach((key) => {
            const value = _imports[key];
            if (typeof value === 'string') {
                imports.push({
                    name: key,
                    localPath: value
                });
            } else if (Array.isArray(value)) {
                imports.push({
                    name: key,
                    localPath: value[0],
                    remoteUrl: value[1]
                });
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
    exports.forEach(({ importName, externalName }) => {
        externals[externalName] = {
            match: new RegExp(`^${externalName}$`),
            import: importName
        };
    });

    imports.forEach(({ name }) => {
        externals[name] = {
            match: new RegExp(`^${[name]}/`)
        };
    });
    return { name, exports, imports, externals };
}
