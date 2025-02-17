# manifest.json 模块说明

## 概述

manifest.json 是 Gez 框架中负责处理服务构建清单的核心模块。它定义了构建产物的元数据结构，并提供了读取和解析这些元数据的功能。本文档详细说明模块的数据结构和使用方法。

## 数据结构

### ManifestJsonChunks

定义单个源文件编译后的产物信息：

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

### ManifestJson

定义整个服务的构建清单：

```typescript
interface ManifestJson {
    name: string;                              // 服务名称
    exports: Record<string, string>;           // 导出文件映射表
    buildFiles: string[];                      // 所有构建文件列表
    chunks: Record<string, ManifestJsonChunks>;// 源文件到构建信息的映射
}
```

## 使用示例

### 基本示例

```json
{
    "name": "your-app-name",
    "exports": {
        "src/entry": "src/entry.abc123.js",
        "npm/vue": "npm/vue.def456.js"
    },
    "buildFiles": [
        "src/entry.abc123.js",
        "chunks/common.ghi789.js",
        "npm/vue.def456.js"
    ],
    "chunks": {
        "your-app-name@src/entry.ts": {
            "js": "./src/entry.abc123.js",
            "css": ["./src/entry.abc123.css"],
            "resources": [],
            "sizes": {
                "js": 10000,
                "css": 5000,
                "resource": 0
            }
        }
    }
}
```

### 在代码中使用

```typescript
import { Gez } from '@gez/core';

const gez = new Gez({
    root: './src',
    isProd: process.env.NODE_ENV === 'production'
});

// 获取构建清单
const manifests = await gez.getManifestList('client');

// 获取入口模块信息
const entryModule = manifests.find(m => m.exports['src/entry']);
if (entryModule) {
    const chunkInfo = entryModule.chunks['src/entry'];
    console.log('Entry JS:', chunkInfo.js);
    console.log('Entry CSS:', chunkInfo.css);
}
```

## 构建工具集成

### 文件命名规范

- JS 文件：`[name].[hash].js`
- CSS 文件：`[name].[hash].css`
- 资源文件：`[name].[hash].[ext]`

### 目录结构规范

```
dist/
├── src/                 # 源码编译产物
├── npm/                 # npm 依赖
└── chunks/              # 动态生成的代码块
```

### 路径处理规范

- 导出路径：保持与源码相对路径一致
- npm 依赖：使用 `npm/` 前缀
- 动态代码块：使用 `chunks/` 前缀

## 最佳实践

1. **文件组织**
   - 遵循目录结构规范
   - 使用一致的命名规则
   - 合理组织代码块

2. **性能优化**
   - 合理拆分代码块
   - 优化资源大小
   - 利用缓存机制

3. **维护管理**
   - 定期清理旧文件
   - 监控资源大小
   - 保持文件结构清晰
