# ManifestJson

`manifest.json` 是 Gez 框架在构建过程中生成的清单文件，用于记录服务构建的产物信息。它提供了统一的接口来管理构建产物、导出文件和资源大小统计。

```json title="dist/client/manifest.json"
{
  "name": "your-app-name",
  "exports": {
    "src/entry.client": "src/entry.client.8537e1c3.final.js",
    "src/title/index": "src/title/index.2d79c0c2.final.js"
  },
  "buildFiles": [
    "src/entry.client.2e0a89bc.final.css",
    "images/cat.ed79ef6b.final.jpeg",
    "chunks/830.63b8fd4f.final.css",
    "images/running-dog.76197e20.final.gif",
    "chunks/473.42c1ae75.final.js",
    "images/starry.d914a632.final.jpg",
    "images/sun.429a7bc5.final.png",
    "chunks/473.63b8fd4f.final.css",
    "images/logo.3923d727.final.svg",
    "chunks/534.63b8fd4f.final.css",
    "src/title/index.2d79c0c2.final.js",
    "src/entry.client.8537e1c3.final.js",
    "chunks/534.e85c5440.final.js",
    "chunks/830.cdbdf067.final.js"
  ],
  "chunks": {
    "your-app-name@src/views/home.ts": {
      "js": "chunks/534.e85c5440.final.js",
      "css": ["chunks/534.63b8fd4f.final.css"],
      "resources": [
        "images/cat.ed79ef6b.final.jpeg",
        "images/logo.3923d727.final.svg",
        "images/running-dog.76197e20.final.gif",
        "images/starry.d914a632.final.jpg",
        "images/sun.429a7bc5.final.png"
      ],
      "sizes": {
        "js": 7976,
        "css": 5739,
        "resource": 796974
      }
    }
  }
}
```

## 类型定义
### ManifestJson

```ts
interface ManifestJson {
  name: string;
  exports: Record<string, string>;
  buildFiles: string[];
  chunks: Record<string, ManifestJsonChunks>;
}
```

#### name

- **类型**: `string`

服务名称，来自于 GezOptions.name 配置。

#### exports

- **类型**: `Record<string, string>`

对外导出的文件映射关系，key 为源文件路径，value 为构建后的文件路径。

#### buildFiles

- **类型**: `string[]`

构建产物的完整文件清单，包含所有生成的文件路径。

#### chunks

- **类型**: `Record<string, ManifestJsonChunks>`

源文件与编译产物的对应关系，key 为源文件路径，value 为编译信息。

### ManifestJsonChunks

```ts
interface ManifestJsonChunks {
  js: string;
  css: string[];
  resources: string[];
  sizes: ManifestJsonChunkSizes;
}
```

#### js

- **类型**: `string`

当前源文件编译后的 JS 文件路径。

#### css

- **类型**: `string[]`

当前源文件关联的 CSS 文件路径列表。

#### resources

- **类型**: `string[]`

当前源文件关联的其它资源文件路径列表。

#### sizes

- **类型**: `ManifestJsonChunkSizes`

构建产物的大小统计信息。

### ManifestJsonChunkSizes

```ts
interface ManifestJsonChunkSizes {
  js: number;
  css: number;
  resource: number;
}
```

#### js

- **类型**: `number`

JS 文件大小（字节）。

#### css

- **类型**: `number`

CSS 文件大小（字节）。

#### resource

- **类型**: `number`

资源文件大小（字节）。