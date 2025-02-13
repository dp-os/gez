# Gez SSR Base

一个轻量级的服务端渲染框架示例，展示了如何使用 Gez 构建现代化的 Web 应用。

## 特点

- **高性能** - 基于 Rust 构建，提供极致的性能表现
- **易用性** - 约定优于配置，开箱即用的开发体验
- **可扩展** - 支持中间件和插件系统，灵活定制功能

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/dp-os/gez.git
cd gez/examples/ssr-base
```

2. 安装 pnpm（如果未安装）
```bash
npm install -g pnpm
```

3. 安装依赖
```bash
pnpm install
```

4. 启动开发服务器
```bash
pnpm dev
```

## 项目结构

```
src/
├── entry.client.ts     # 客户端入口文件
├── entry.node.ts       # Node.js 服务器入口文件
├── entry.server.ts     # 服务端渲染入口文件
└── title.ts            # 页面标题配置文件
```

## 在线预览

访问 [在线示例](https://dp-os.github.io/gez/ssr-base/) 查看运行效果。

## 相关链接

- [项目文档](https://dp-os.github.io/gez/)
- [GitHub 仓库](https://github.com/dp-os/gez)

## 许可证

MIT