# ManifestJson

manifest.json 是构建过程中生成的清单文件，用于记录服务构建的产物信息。它包含了以下主要特性：

- 记录服务名称和导出文件的映射关系
- 维护构建产物的完整文件清单
- 追踪源文件与编译产物的对应关系
- 统计各类文件的大小信息

## 类型定义

### ManifestJson

定义服务构建清单的主要数据结构。

```typescript
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
}
```

### ManifestJsonChunks

定义单个源文件编译后的产物信息。

```typescript
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
```

### ManifestJsonChunkSizes

定义构建产物的大小统计信息。

```typescript
export interface ManifestJsonChunkSizes {
    /**
     * JS 文件大小（字节）
     */
    js: number;
    /**
     * CSS 文件大小（字节）
     */
    css: number;
    /**
     * 资源文件大小（字节）
     */
    resource: number;
}
```