# Gez
Gez 一个基于 **[Rspack](https://rspack.dev/)** 构建的 **[Pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)** 解决方案，通过 **[importmap](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap)** 将多服务的模块映射到具有哈希缓存的文件中。

## ✨ 特性
- 🚀 **项目构建**: 基于 Rspack 实现，构建速度极快，带给你极致的开发体验。
- ☁️ **后端渲染**: 支持 Vue2、Vue3、React 等不同框架实现 SSR 
- 🎯 **依赖管理**: 一次发布，多服务生效
- 👏 **长久维护**: 从 [Genesis](https://www.npmjs.com/package/@fmfe/genesis-core) 2019 年迭代至今，现更名为: [Gez](https://www.npmjs.com/package/@gez/core)

## 快速开始
```sh
# 安装生产依赖
pnpm install @gez/core express
# 安装开发依赖
pnpm install @gez/rspack -D
```