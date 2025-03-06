# Gez SSR Vue2 Remote

一个基于 Vue2 的微前端 Remote 应用示例，展示了如何使用 Gez 构建可被 Host 应用集成的独立模块，支持服务端渲染。

## 特点

- 🚀 **高性能**   - 基于 Rust 构建的 Rspack，提供极致的构建性能
- 💡 **模块输出** - 支持 Module Link，可被其他应用无缝集成
- 🛠 **开发体验** - 快速的热更新、友好的错误提示和完整的类型支持
- 📱 **SSR支持** - 完整的服务端渲染支持，确保与 Host 应用的 SSR 能力对接

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/open-esm/gez.git
cd gez/examples/ssr-vue2-remote
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
│   └── button/             # 按钮组件
├── styles/                 # 全局样式
├── assets/                 # 静态资源
├── entry-client.ts         # 客户端入口
├── entry-server.ts         # 服务端入口
├── expose.ts               # Module Link 导出配置
└── App.vue                 # 根组件
```

## 在线预览

访问 [在线示例](https://open-esm.github.io/gez/ssr-vue2-remote/) 查看运行效果。

## 相关链接

- [项目文档](https://open-esm.github.io/gez/)
- [GitHub 仓库](https://github.com/open-esm/gez)

## 许可证

MIT