# Gez 核心模块

## 概述
`gez.ts` 是框架的核心入口模块，负责初始化、配置解析和生命周期管理。

## 配置项

### GezOptions
```typescript
export interface GezOptions {
    /**
     * 项目根目录
     * @default process.cwd()
     */
    root?: string;

    /**
     * 环境标识
     * @default process.env.NODE_ENV === 'production'
     */
    isProd?: boolean;

    /**
     * 基础路径占位符
     * @default '[[[___GEZ_DYNAMIC_BASE___]]]'
     */
    basePathPlaceholder?: string | false;

    /** 模块配置 */
    modules?: ModuleConfig;

    /** 打包配置 */
    packs?: PackConfig;

    /** 开发环境应用创建器 */
    createDevApp?: (gez: Gez) => Promise<App>;

    /** HTTP 服务创建器 */
    createServer?: (gez: Gez) => Promise<void>;

    /** 生产环境构建后处理器 */
    postCompileProdHook?: (gez: Gez) => Promise<void>;
}
```

### ModuleConfig
```typescript
interface ModuleConfig {
    /**
     * 模块导出配置
     * @example
     * // 无类型导出
     * exports: ['npm:axios']
     * 
     * // 有类型导出
     * exports: ['root:src/axios.ts']
     */
    exports?: string[];

    /**
     * 模块导入配置
     * @example
     * imports: {
     *   // 源码安装：指向构建产物目录
     *   'ssr-base': 'root:../ssr-base/dist',
     *   // 软件包安装：指向包目录
     *   'ui-lib': 'root:./node_modules/ui-lib'
     * }
     */
    imports?: Record<string, string>;

    /**
     * 外部依赖配置
     * @example
     * externals: {
     *   'axios': 'ssr-base/src/axios'
     * }
     */
    externals?: Record<string, string>;
}
```

### PackConfig
```typescript
interface PackConfig {
    /**
     * 是否启用打包功能
     * 启用后会将构建产物打包成标准的 npm .tgz 格式软件包
     * @default false
     */
    enable?: boolean;

    /**
     * 指定输出的软件包文件路径
     * - string: 单个输出路径，如 'dist/versions/my-app.tgz'
     * - string[]: 多个输出路径，用于同时生成多个版本
     * - boolean: true 时使用默认路径 'dist/client/versions/latest.tgz'
     */
    outputs?: string | string[] | boolean;

    /**
     * 自定义 package.json
     * @param gez Gez 实例
     * @param pkg 原始 package.json 内容
     * @returns 处理后的 package.json 内容
     */
    packageJson?: (
        gez: Gez,
        pkg: Record<string, any>
    ) => Promise<Record<string, any>>;

    /**
     * 打包前准备
     * @param gez Gez 实例
     * @param pkg package.json 内容
     */
    onBefore?: (gez: Gez, pkg: Record<string, any>) => Promise<void>;

    /**
     * 打包后处理
     * @param gez Gez 实例
     * @param pkg package.json 内容
     * @param file 打包文件内容
     */
    onAfter?: (
        gez: Gez,
        pkg: Record<string, any>,
        file: Buffer
    ) => Promise<void>;
}
```