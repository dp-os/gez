# Gez SSR HTML

一个完整的 HTML 服务端渲染示例，展示了如何使用 Gez 构建现代化的 Web 应用，包含路由、组件、样式和资源管理等特性。

## 特点

- 🚀 **高性能** - 基于 Rust 构建的 Rspack，提供极致的构建性能
- 💡 **完整特性** - 包含路由、组件、样式、图片等完整功能支持
- 🛠 **开发体验** - 快速的热更新、友好的错误提示和完整的类型支持
- 📱 **响应式** - 现代化的响应式设计，完美适配各种设备

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/dp-os/gez.git
cd gez/examples/ssr-html
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

## 在线预览

访问 [在线示例](https://dp-os.github.io/gez/ssr-html/) 查看运行效果。

## 相关链接

- [项目文档](https://dp-os.github.io/gez/)
- [GitHub 仓库](https://github.com/dp-os/gez)

## 许可证

MIT