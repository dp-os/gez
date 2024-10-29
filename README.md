# Gez
Gez 是一个基于 **[Rspack](https://rspack.dev/)** 构建的 **[Pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)** 解决方案，通过 **[importmap](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap)** 将多服务的模块映射到具有哈希缓存的文件中，是世界上首个基于 Pure ESM 构建的 SSR 多服务聚合框架。

## ✨ 特性
- 🚀 **项目构建**：基于 Rspack 实现，构建速度极快，带给你极致的开发体验。
- ☁️ **同构渲染**：支持 Vue2、Vue3、React 等不同框架实现 SSR。
- 🎯 **依赖管理**：一次发布，多服务生效。
- 👍 **技术创新**：首个基于 Pure ESM 构建的 SSR 多服务聚合框架。
- 😎 **基准支持**：Node20 和支持 [ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) 和 [import.meta](https://caniuse.com/mdn-javascript_operators_import_meta) 的浏览器。
- 👏 **长久维护**：从 [Genesis](https://www.npmjs.com/package/@fmfe/genesis-core) 2020 年迭代至今，现更名为: [Gez](https://www.npmjs.com/package/@gez/core)。

## 📚 文档
- [为什么选 Gez](./docs/zh-CN/why.md)
- [基本概念](./docs/zh-CN/quick-start/basic-concept.md)
- 快速开始
  - [HTML](./docs/zh-CN/quick-start/html.md)
  - [vue2-single](./docs/zh-CN/quick-start/vue2-single.md)