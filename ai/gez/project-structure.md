# 项目结构规范

## 概述

Gez 是一个现代化的 SSR 框架，采用标准化的项目结构和路径解析机制，以确保项目在开发和生产环境中的一致性和可维护性。本文档详细说明框架的目录结构和关键配置。

## 项目结构

### 源码目录（src/）

源码目录是项目的核心，包含了三个重要的入口文件：

```
src/
├── entry.client.ts # 客户端入口文件
├── entry.server.ts # 服务端入口文件
└── entry.node.ts   # Node 环境入口文件
```

#### entry.client.ts

客户端入口文件负责：
- 初始化客户端应用
- 处理客户端路由
- 实现客户端状态管理
- 处理客户端事件和交互

#### entry.server.ts

服务端入口文件负责：
- 执行服务端渲染（SSR）
- 生成初始 HTML
- 处理数据预取
- 注入状态数据
- 确保 SEO 优化

#### entry.node.ts

Node.js 服务器入口文件负责：
- 配置和启动 HTTP 服务器
- 处理服务端路由
- 集成中间件
- 管理环境变量
- 处理服务端请求和响应

### 构建输出目录（dist/）

构建过程会生成以下目录结构：

```
dist/
├── index.js           # 生产环境的 Node.js 服务器入口
├── server/            # 服务端渲染相关
│   └── manifest.json  # 服务端资源映射文件
├── node/              # Node.js 服务器运行时代码
└── client/            # 客户端资源
    └── manifest.json  # 客户端资源映射文件
```

## 配置文件

### package.json

项目根目录的 package.json 文件包含以下重要配置：

```json
{
  "name": "your-app-name",  // 服务唯一标识，用于部署和服务发现
  "type": "module",        // 启用 ESM 模块系统（必需）
  "scripts": {
    "dev": "gez dev",      // 开发环境启动命令
    "build": "npm run build:dts && npm run build:ssr",  // 生产环境构建命令
    "build:ssr": "gez build",  // SSR 构建命令
    "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src",  // 类型声明文件生成命令
    "preview": "gez preview",  // 预览生产环境命令
    "start": "NODE_ENV=production node dist/index.js"  // 生产环境启动命令
  }
}
```

#### 关键字段说明

- **name**: 项目的唯一标识符，用于服务注册和部署。建议使用有意义的名称，遵循 npm 包命名规范。
- **type**: 必须设置为 "module"，启用 ECMAScript 模块系统，这是 Gez 框架的必要配置。

#### 命令说明

##### dev
开发环境启动命令：
- 启动开发服务器，支持实时预览
- 启用热更新（HMR），提高开发效率
- 提供开发时的调试工具和错误提示
- 自动编译和重载变更的代码

##### build
生产环境构建命令，包含两个步骤：
1. build:dts：生成 TypeScript 类型声明文件
   - 确保类型安全
   - 提供 IDE 智能提示
   - 对于 Vue 项目，需要使用 vue-tsc 命令代替 tsc：
     ```bash
     vue-tsc --declaration --emitDeclarationOnly --outDir dist/src
     ```
     这是因为 Vue 项目中的 .vue 单文件组件包含类型信息，需要使用专门的编译器来处理。
2. build:ssr：构建生产环境代码
   - 生成优化后的客户端代码
   - 构建服务端渲染代码
   - 生成 Node.js 运行时代码
   - 输出资源映射文件

##### preview
预览生产环境命令：
- 使用生产环境配置启动本地服务器
- 用于在部署前测试构建结果
- 验证生产环境的性能和功能

##### start
生产环境启动命令：
- 启动优化后的 Node.js 服务器
- 提供高性能的服务端渲染
- 运行在生产环境模式下
- 不支持热更新，代码更新需要重新构建和部署
