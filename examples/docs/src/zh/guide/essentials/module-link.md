---
titleSuffix: Gez 框架服务间代码共享机制
description: 详细介绍 Gez 框架的模块链接机制，包括服务间代码共享、依赖管理和 ESM 规范实现，帮助开发者构建高效的微前端应用。
head:
  - - meta
    - property: keywords
      content: Gez, 模块链接, Module Link, ESM, 代码共享, 依赖管理, 微前端
---

# 模块链接

Gez 框架提供了一套完整的模块链接机制，用于管理服务间的代码共享和依赖关系。该机制基于 ESM（ECMAScript Module）规范实现，支持源码级别的模块导出和导入，以及完整的依赖管理功能。

### 核心概念

#### 模块导出
模块导出是将服务中的特定代码单元（如组件、工具函数等）以 ESM 格式对外暴露的过程。支持两种导出类型：
- **源码导出**：直接导出项目中的源代码文件
- **依赖导出**：导出项目使用的第三方依赖包

#### 模块导入
模块导入是在服务中引用其他服务导出的代码单元的过程。支持多种安装方式：
- **源码安装**：适用于开发环境，支持实时修改和热更新
- **软件包安装**：适用于生产环境，直接使用构建产物

### 预加载机制

为了优化服务性能，Gez 实现了智能的模块预加载机制：

1. **依赖分析**
   - 构建时分析组件间的依赖关系
   - 识别关键路径上的核心模块
   - 确定模块的加载优先级

2. **加载策略**
   - **立即加载**：关键路径上的核心模块
   - **延迟加载**：非关键功能模块
   - **按需加载**：条件渲染的模块

3. **资源优化**
   - 智能的代码分割策略
   - 模块级别的缓存管理
   - 按需编译和打包

## 模块导出

### 配置说明

在 `entry.node.ts` 中配置需要导出的模块：

```ts
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // 导出源码文件
            'root:src/components/button.vue',  // Vue 组件
            'root:src/utils/format.ts',        // 工具函数
            // 导出第三方依赖
            'npm:vue',                         // Vue 框架
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

导出配置支持两种类型：
- `root:*`：导出源码文件，路径相对于项目根目录
- `npm:*`：导出第三方依赖，直接指定包名

## 模块导入

### 配置说明

在 `entry.node.ts` 中配置需要导入的模块：

```ts
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // 导入配置
        imports: {
            // 源码安装：指向构建产物目录
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // 软件包安装：指向包目录
            'other-remote': 'root:./node_modules/other-remote'
        },
        // 外部依赖配置
        externals: {
            // 使用远程模块中的依赖
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

配置项说明：
1. **imports**：配置远程模块的本地路径
   - 源码安装：指向构建产物目录（dist）
   - 软件包安装：直接指向包目录

2. **externals**：配置外部依赖
   - 用于共享远程模块中的依赖
   - 避免重复打包相同依赖
   - 支持多个模块共享依赖

### 安装方式

#### 源码安装
适用于开发环境，支持实时修改和热更新。

1. **Workspace 方式**
推荐在 Monorepo 项目中使用：
```json
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Link 方式**
用于本地开发调试：
```json
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### 软件包安装
适用于生产环境，直接使用构建产物。

1. **NPM Registry**
通过 npm registry 安装：
```json
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **静态服务器**
通过 HTTP/HTTPS 协议安装：
```json
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## 软件包构建

### 配置说明

在 `entry.node.ts` 中配置构建选项：

```ts
import type { GezOptions } from '@gez/core';

export default {
    // 模块导出配置
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // 构建配置
    pack: {
        // 启用构建
        enable: true,

        // 输出配置
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // 自定义 package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // 构建前处理
        onBefore: async (gez, pkg) => {
            // 生成类型声明
            // 执行测试用例
            // 更新文档等
        },

        // 构建后处理
        onAfter: async (gez, pkg, file) => {
            // 上传到 CDN
            // 发布到 npm 仓库
            // 部署到测试环境等
        }
    }
} satisfies GezOptions;
```

### 构建产物

```
your-app-name.tgz
├── package.json         # 包信息
├── index.js            # 生产环境入口
├── server/             # 服务端资源
│   └── manifest.json   # 服务端资源映射
├── node/               # Node.js 运行时
└── client/             # 客户端资源
    └── manifest.json   # 客户端资源映射
```

### 发布流程

```bash
# 1. 构建生产版本
gez build

# 2. 发布到 npm
npm publish dist/versions/your-app-name.tgz
```

## 最佳实践

### 开发环境配置
- **依赖管理**
  - 使用 Workspace 或 Link 方式安装依赖
  - 统一管理依赖版本
  - 避免重复安装相同依赖

- **开发体验**
  - 启用热更新功能
  - 配置合适的预加载策略
  - 优化构建速度

### 生产环境配置
- **部署策略**
  - 使用 NPM Registry 或静态服务器
  - 确保构建产物完整性
  - 实施灰度发布机制

- **性能优化**
  - 合理配置资源预加载
  - 优化模块加载顺序
  - 实施有效的缓存策略

### 版本管理
- **版本规范**
  - 遵循语义化版本规范
  - 维护详细的更新日志
  - 做好版本兼容性测试

- **依赖更新**
  - 及时更新依赖包
  - 定期进行安全审计
  - 保持依赖版本一致性
