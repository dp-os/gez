# 模块链接

## 概述

Gez 框架提供了一套完整的模块链接机制，用于管理服务间的代码共享和依赖关系。本文档详细说明如何在 Gez 框架中实现模块的导出、导入和依赖管理。

## 核心概念

### 模块导出
模块导出是将服务中的特定代码单元（如组件、工具函数等）以 ESM 格式对外暴露，使其可被其他服务引用。

### 模块导入
模块导入是在服务中引用其他服务导出的代码单元的过程，支持多种安装方式以满足不同场景需求。

## 配置指南

### 导出配置

在 `entry.node.ts` 中配置需要导出的模块：

```ts
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // 导出源码文件
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            // 导出第三方依赖
            'npm:vue',
            'npm:vue-router'
        ]
    }
} satisfies GezOptions;
```

### 安装方式

#### 源码安装
源码安装方式需要执行构建，导入时需要指向 dist 目录。

##### 1. Workspace 方式
推荐在 Monorepo 项目中使用：

```json
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

**优势**：
- 支持多包协同开发
- 依赖版本统一管理
- 便于调试和代码共享

##### 2. Git 协议安装
通过 Git 协议安装源码，在安装时执行构建：

```json
{
    "name": "ssr-remote",
    "type": "module",
    "scripts": {
        "prepare": "npm run build",
        "build": "npm run build:dts && npm run build:ssr",
        "build:ssr": "gez build",
        "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src"
    },
    "devDependencies": {
        "ssr-remote": "git+ssh://git@github.com/your-org/ssr-remote.git#main"
    }
}
```

**优势**：
- 直接从源码构建
- 支持任意分支/tag
- 适合开发环境使用

**局限性**：
- 安装时间较长
- 需要构建环境
- 不适合生产环境

#### 软件包安装
软件包安装方式直接使用构建后的产物，导入时直接指向模块目录。

##### 3. Link 方式
用于本地开发调试：

```json
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote/dist"
    }
}
```

**优势**：
- 直接链接构建产物
- 支持实时构建更新
- 无需重新安装即可测试

##### 4. 静态服务器安装
将构建产物部署到静态服务器，支持 HTTP 或 HTTPS 协议：

```json
{
    "devDependencies": {
        "ssr-remote": "https://static.example.com/ssr-remote/versions/latest.tgz"
    }
}
```

**优势**：
- 简单直接，易于部署
- 支持版本控制和回滚
- 适合小型团队使用

##### 5. 私有镜像源安装
将软件包发布到私有 npm 镜像源：

```json
{
    "devDependencies": {
        "ssr-remote": "1.0.0"
    }
}
```

```bash
# .npmrc 配置
@your-scope:registry=https://npm.your-registry.com/
```

**优势**：
- 完整的包管理机制
- 支持版本管理和分析
- 适合大型团队协作

##### 6. File 协议安装
将构建产物提交到 Git 仓库，通过 file 协议安装：

```json
{
    "devDependencies": {
        "ssr-remote": "file:./packages/versions/ssr-remote-1.0.0.tgz"
    }
}
```

**Polyrepo 注意事项**：
1. **分支管理**：
   - 每个分支使用独立版本号
   - 版本号包含分支信息
   - 避免分支间版本冲突

2. **分支切换**：
   - 切换分支时重新安装依赖
   - 确保使用正确版本
   - 建议自动化版本切换

### PackConfig 说明
软件包安装方式需要配置打包选项，包括启用打包、指定输出路径和自定义 package.json。

```ts title="ssr-base/src/entry.node.ts" {5-16}
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: ['root:src/axios.ts']
    },
    packs: {
        // 启用打包功能
        enable: true,
        // 指定输出路径，支持多版本
        outputs: [
            'dist/versions/latest.tgz',
            'dist/versions/1.0.0.tgz'
        ],
        // 自定义 package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        }
    }
} satisfies GezOptions;
```

### 服务导入配置

安装完依赖后，需要在服务中配置模块导入和外部依赖：

#### 模块导入
在 `entry.node.ts` 中配置模块导入路径：

```ts
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        imports: {
            // 源码安装方式（Workspace、Git）：需要指向 dist 目录
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            
            // 软件包安装方式（Link、静态服务器、私有镜像源、File）：直接指向包目录
            'other-remote': 'root:./node_modules/other-remote'
        }
    }
} satisfies GezOptions;
```

> **💡 提示**
> - 源码安装（Workspace、Git）需要指向构建产物目录
> - 软件包安装直接指向安装目录，因为安装的就是构建产物
> - 确保配置的路径存在且可访问

#### 外部依赖配置
配置要使用的外部依赖：

```ts
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        externals: {
            // 使用远程模块中的依赖
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

#### 使用示例
导入并使用远程模块：

```ts
// 1. 集中导入相关组件，避免过多的网络请求
import { Button, Input, Form } from 'ssr-remote/components';
// 2. 工具函数建议按模块导入
import { format } from 'ssr-remote/utils';
// 3. 外部依赖通常是整体导入
import { createApp } from 'vue';

// 使用示例
const app = createApp({
    components: {
        'remote-button': Button,
        'remote-input': Input,
        'remote-form': Form
    }
});

const { formatDate, formatTime } from format;
const date = formatDate(new Date());
```

> **💡 导入策略建议**
> - 组件导入：
>   - 同一页面的组件建议集中导入
>   - 不同页面的组件可以按需导入
>   - 考虑使用动态导入做代码分割
> - 工具函数：
>   - 频繁使用的工具函数建议打包在一起
>   - 较大的工具函数可以考虑按需导入
>   - 评估导入粒度对构建产物的影响
> - 性能考虑：
>   - 过细的导入会增加网络请求数
>   - 过粗的导入会增加初始加载体积
>   - 需要在请求数和包体积间找到平衡
> - 构建优化：
>   - 利用构建工具的 Tree Shaking
>   - 合理配置代码分割策略
>   - 考虑使用路由级别的代码分割

### 安全建议

1. **传输安全**：
   - 建议使用 HTTPS 协议
   - 配置访问认证
   - 避免未授权访问

2. **版本管理**：
   - 遵循语义化版本
   - 定期清理旧版本
   - 维护版本更新日志

3. **构建安全**：
   - 验证构建产物完整性
   - 使用可信源安装依赖
   - 定期更新依赖版本

## 最佳实践

1. **开发环境**：
   - 使用 Workspace 或 Link 方式
   - 配置自动构建和热更新
   - 保持依赖版本一致

2. **测试环境**：
   - 使用与生产环境相同的安装方式
   - 验证构建产物的正确性
   - 测试不同安装方式的兼容性

3. **生产环境**：
   - 使用稳定的安装源
   - 锁定具体的依赖版本
   - 确保构建环境的一致性