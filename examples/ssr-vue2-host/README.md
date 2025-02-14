# Gez SSR Vue2 Host

一个基于 Vue2 的微前端 Host 应用示例，展示了如何使用 Gez 构建现代化的服务端渲染应用，并通过 Module Link 集成 Remote 应用。

## 特点

- 🚀 **高性能** - 基于 Rust 构建的 Rspack，提供极致的构建性能
- 💡 **微前端架构** - 使用 Module Link 实现应用解耦和独立部署
- 🛠 **开发体验** - 快速的热更新、友好的错误提示和完整的类型支持
- 📱 **SSR支持** - 完整的服务端渲染支持，提供更好的首屏体验和SEO

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/dp-os/gez.git
cd gez/examples/ssr-vue2-host
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
├── components/             # 共享组件
│   └── layout/             # 布局相关组件
├── pages/                  # 页面组件
│   ├── home/               # 首页
│   └── about/              # 关于页面
├── styles/                 # 全局样式
├── assets/                 # 静态资源
├── entry-client.ts         # 客户端入口
├── entry-server.ts         # 服务端入口
├── router.ts               # 路由配置
└── App.vue                 # 根组件
```

## 在线预览

访问 [在线示例](https://dp-os.github.io/gez/ssr-vue2-host/) 查看运行效果。

## 相关链接

- [项目文档](https://dp-os.github.io/gez/)
- [GitHub 仓库](https://github.com/dp-os/gez)

## 许可证

MIT