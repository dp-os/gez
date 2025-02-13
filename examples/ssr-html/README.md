# SSR HTML 示例

这是一个使用 Gez 构建的服务端渲染（SSR）示例项目，展示了如何使用 Gez 构建一个现代化的服务端渲染应用。

## 特性

- 🚀 **服务端渲染** - 基于 @gez/core 的同构渲染方案
- 🎯 **TypeScript** - 使用 TypeScript 编写，提供完整的类型支持
- 📦 **Rspack** - 基于 Rust 的高性能构建工具
- 🖼️ **图片处理** - 支持 SVG、JPG、PNG、GIF 等多种格式
- 🎨 **样式处理** - 模块化的 CSS 支持
- 📱 **响应式设计** - 适配各种设备的现代布局

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── components/       # 共享组件
│   ├── layout.ts    # 布局组件
│   └── layout.css   # 布局样式
├── views/           # 页面组件
│   ├── home.ts      # 首页
│   ├── about.ts     # 关于页面
│   └── not-found.ts # 404页面
├── styles/          # 全局样式
├── images/          # 图片资源
├── entry.client.ts  # 客户端入口
├── entry.server.ts  # 服务端入口
├── entry.node.ts    # Node 环境入口
├── routes.ts        # 路由配置
└── page.ts          # 基础页面类
```

## 技术栈

- **框架**: Gez SSR
- **语言**: TypeScript
- **构建**: Rspack
- **样式**: CSS Modules
- **路由**: 内置路由系统
- **部署**: 支持静态部署和 Node.js 服务器

## 主要功能

### 1. 路由系统
- 支持首页和关于页面
- 自动处理 404 页面
- 组件按需加载

### 2. 页面组件
- 基于 Page 类的组件系统
- 服务端和客户端生命周期
- 状态管理和属性传递

### 3. 资源优化
- 自动的代码分割
- 资源预加载
- 样式按需注入
- 图片优化处理

### 4. 开发体验
- 快速的热更新
- 友好的错误提示
- 完整的类型支持
- 简洁的项目结构

## 示例页面

- **首页** (`/`): 展示图片处理能力
- **关于** (`/about`): 介绍项目特性
- **404**: 优雅的错误处理

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个示例项目。

## 许可

MIT License