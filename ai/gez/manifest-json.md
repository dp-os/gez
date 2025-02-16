# manifest-json 模块说明

## 目录
1. [概述](#概述)
2. [manifest.json 格式](#manifestjson-格式)
3. [构建工具接入指南](#构建工具接入指南)
4. [使用示例](#使用示例)

## 概述

manifest-json 是 Gez 框架中负责处理服务构建清单的核心模块。它定义了构建产物的元数据结构，并提供了读取和解析这些元数据的功能。

## manifest.json 格式

### 数据结构

#### ManifestJsonChunks

这个接口定义了单个源文件编译后的产物信息：

```typescript
interface ManifestJsonChunks {
    js: string;           // 编译后的 JS 文件路径
    css: string[];        // 编译后的 CSS 文件路径列表
    resources: string[];  // 其他资源文件路径列表
    sizes: {              // 各类文件的大小统计
        js: number;       // JS 文件大小（字节）
        css: number;      // CSS 文件大小（字节）
        resource: number; // 资源文件大小（字节）
    };
}
```

#### ManifestJson

这个接口定义了整个服务的构建清单：

```typescript
interface ManifestJson {
    name: string;                              // 服务名称
    exports: Record<string, string>;           // 导出文件映射表
    buildFiles: string[];                      // 所有构建文件列表
    chunks: Record<string, ManifestJsonChunks>;// 源文件到构建信息的映射
}
```

### 示例

```json
{
    "name": "your-app-name",
    "exports": {
        "src/entry": "src/entry.abc123.final.js",
        "npm/vue": "npm/vue.def456.final.js"
    },
    "buildFiles": [
        "src/entry.abc123.final.js",
        "chunks/common.ghi789.final.js",
        "chunks/common.jkl012.final.css",
        "npm/vue.def456.final.js"
    ],
    "chunks": {
        "your-app-name@src/entry.ts": {
            "js": "./src/entry.abc123.final.js",
            "css": [],
            "resources": [],
            "sizes": {
                "js": 10000,
                "css": 0,
                "resource": 0
            }
        },
        "your-app-name@npm/vue": {
            "js": "./npm/vue.def456.final.js",
            "css": [],
            "resources": [],
            "sizes": {
                "js": 100000,
                "css": 0,
                "resource": 0
            }
        }
    }
}
```

## 构建工具接入指南

### 构建工具支持

不同的构建工具需要在特定的构建阶段生成 manifest.json：

1. **Webpack**
   - 使用 emit 钩子
   - 在最终输出前收集产物信息

2. **Vite**
   - 使用 writeBundle 钩子
   - 在产物写入磁盘时处理

3. **Rollup**
   - 使用 generateBundle 钩子
   - 在生成最终产物时处理

### 接入要求

1. **文件命名规范**
   - 所有产物文件名必须包含内容哈希
   - JS 文件使用 `.final.js` 后缀
   - CSS 文件使用 `.final.css` 后缀

2. **目录结构**
   - npm 依赖放在 `npm/` 目录
   - 动态生成的代码块放在 `chunks/` 目录
   - 源码编译产物保持原有目录结构

3. **路径处理**
   - 导出路径需要保持与源码相对路径一致
   - 第三方依赖使用 `npm/` 前缀

4. **性能统计**
   - 确保准确收集各类文件的大小信息
   - JS、CSS、资源文件分别统计
   - 文件大小使用字节数表示

## 使用示例

### 基础用法

```typescript
import { Gez } from '@gez/core';

// 创建 Gez 实例
const gez = new Gez({
    root: './src',
    isProd: process.env.NODE_ENV === 'production'
});

// 获取客户端构建产物信息
const manifests = await gez.getManifestList('client');

// 示例：获取特定组件的资源信息
const entryModule = manifests.find(m => m.exports['src/entry']);
if (entryModule) {
    const chunkInfo = entryModule.chunks['src/entry'];
    console.log('Entry JS:', chunkInfo.js);
    console.log('Entry CSS:', chunkInfo.css);
    console.log('Entry Size:', chunkInfo.sizes);
}
