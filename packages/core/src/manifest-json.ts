export interface ManifestJsonChunks {
    /**
     * 当前编译的 JS 文件。
     */
    js: string;
    /**
     * 当前编译的 CSS 文件。
     */
    css: string[];
    /**
     * 其它的资源文件。
     */
    resources: string[];
    /**
     * 构建产物的大小。
     */
    sizes: ManifestJsonChunkSizes;
}

export interface ManifestJsonChunkSizes {
    js: number;
    css: number;
    resource: number;
}

export interface ManifestJson {
    /**
     * 服务名字，来自于：GezOptions.name
     */
    name: string;
    /**
     * 对外导出的文件
     */
    exports: Record<string, string>;
    /**
     * 构建的全部文件清单
     */
    buildFiles: string[];
    /**
     * 编译的文件信息
     * 类型：Record<源文件, 编译信息>
     */
    chunks: Record<string, ManifestJsonChunks>;
    /**
     * globalThis.__importmap__ 对象注入导入信息。
     */
    importmapJs: string;
}
