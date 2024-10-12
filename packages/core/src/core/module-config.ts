import path from 'node:path';

export enum PathType {
    npm = 'npm:',
    root = 'root:'
}

export interface ModuleConfig {
    /**
     * dts类型文件生成的目录
     */
    typeDir?: `${PathType.root}${string}`;
    /**
     * 对外导出的文件
     * 必须以 npm: 或 root: 开头
     * npm:开头代表 node_modules 的依赖
     * root:开头代表项目内root目录下的文件
     * 例如:
     *   npm:vue
     *   root:src/routes
     *   root:src/[filename]
     */
    exports?: `${PathType}${string}`[];
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
    /**
     * 当前的服务名字
     */
    name: string;
    /**
     * 当前服务运行的根目录
     */
    root: string;
    /**
     * dts类型文件生成的目录
     */
    typeDir: string;
    /**
     * 对外导出的文件
     */
    exports: {
        /**
         * npm:*
         * root:src/*
         * root:src/routes/index.ts
         */
        name: string;
        type: PathType;
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
    root: string,
    config: ModuleConfig = {}
): ParsedModuleConfig {
    let typeDir: ParsedModuleConfig['typeDir'] = '';
    if (config.typeDir) {
        if (config.typeDir.startsWith(PathType.root)) {
            typeDir = path.resolve(
                root,
                config.typeDir.substring(PathType.root.length)
            );
            if (typeDir === root) {
                throw new Error('[@gez]: typeDir can not be root');
            }
        }
    }

    const exports: ParsedModuleConfig['exports'] = [];
    if (config.exports) {
        config.exports.forEach((key) => {
            if (key.startsWith(PathType.npm)) {
                const exportName = key.substring(PathType.npm.length);

                exports.push({
                    name: key,
                    type: PathType.npm,
                    importName: `${name}/npm/${exportName}`,
                    exportName: `./npm/${exportName}`,
                    exportPath: exportName,
                    externalName: exportName
                });
            } else if (key.startsWith(PathType.root)) {
                const exportName = key.substring(PathType.root.length);

                const exportNameNoSuffix = exportName.replace(/\.(ts|js)$/, '');

                exports.push({
                    name: key,
                    type: PathType.root,
                    importName: `${name}/${exportNameNoSuffix}`,
                    exportName: `./${exportNameNoSuffix}`,
                    exportPath: `./${exportName}`,
                    externalName: `${name}/${exportNameNoSuffix}`
                });
            }
        });
    }
    const imports: ParsedModuleConfig['imports'] = [];
    if (config.imports) {
        const getLocalPath = (dir: string) => {
            if (dir.startsWith(PathType.root)) {
                return path.resolve(root, dir.substring(PathType.root.length));
            } else if (path.isAbsolute(dir)) {
                return dir;
            }
            return path.resolve(process.cwd(), dir);
        };
        const _imports = config.imports;
        Object.keys(config.imports).forEach((key) => {
            const value = _imports[key];
            if (typeof value === 'string') {
                imports.push({
                    name: key,
                    localPath: getLocalPath(value)
                });
            } else if (Array.isArray(value)) {
                imports.push({
                    name: key,
                    localPath: getLocalPath(value[0]),
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

    return { name, root, typeDir, exports, imports, externals };
}
