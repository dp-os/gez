<p align="center">
  <img src="https://www.gez-esm.com/logo.svg" width="180" alt="Gez Logo" />
</p>

<h1 align="center">Gez</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@gez/core"><img src="https://img.shields.io/npm/v/@gez/core.svg" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@gez/core"><img src="https://img.shields.io/npm/dm/@gez/core.svg" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@gez/core"><img src="https://img.shields.io/npm/dt/@gez/core.svg" alt="npm"></a>
</p>

<p align="center">
  <a href="https://www.gez-esm.com/index.html">Gez</a> 基于 <a href="https://rspack.dev/">Rspack</a> 编译，通过 <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap">importmap</a> 将模块映射到具有强缓存、基于内容哈希的 URL 中。
</p>

> **⚠️** 目前 Rspack 对 ESM 支持还存在一些缺陷，如果你不介意，可以在生产环境中使用，待 Rspack 修复这些缺陷后将发布正式版本。
> - `modern-module` 对 `export *` 的输出不稳定，详情见 [issue 8557](https://github.com/web-infra-dev/rspack/issues/8557) 和 [issue 8546](https://github.com/web-infra-dev/rspack/issues/8546)。
> - 动态导入模块的依赖模块被提升到顶级模块，详情见 [issue 8736](https://github.com/web-infra-dev/rspack/issues/8736)。

## 🌈 理念
- 我们应该设计一个基础服务，由基础服务提供所有的第三方依赖。
- 基础服务统一维护第三方依赖更新，一次发布，所有业务系统生效。
- 业务服务仅构建业务代码，所有的第三方依赖应指向基础服务。

## ✨ 特性
- 👍 **技术创新**：首个基于 ESM 构建的 SSR 多服务模块链接。
- 🚀 **项目构建**：基于 Rspack 实现，构建速度极快，带给你极致的开发体验。
- 🎯 **依赖管理**：一次构建，一次发布，多服务生效。
- ☁️ **同构渲染**：支持 Vue2、Vue3、React 等不同框架实现 SSR。
- 😎 **基准支持**：Node22.9 和支持 [ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) 和 [import.meta](https://caniuse.com/mdn-javascript_operators_import_meta) 的浏览器。
- 👏 **长久维护**：[Genesis](https://www.npmjs.com/package/@fmfe/genesis-core) 从 2020 年迭代至今，现更名为 [Gez](https://www.gez-esm.com)。
- 🇨🇳 **中文文档**：中文是第一优先级的语言。

## 📚 文档
- [😎 v3.x 开发阶段](https://www.gez-esm.com)
- [😂 v2.x 持续维护](https://github.com/dp-os/gez/blob/v2/docs/zh-CN/README.md)
- [😖 v1.x 停止维护](https://fmfe.github.io/genesis-docs/guide/)

## 📖 示例项目
探索以下示例项目，快速了解 Gez 的强大功能：
- [ssr-base](https://www.gez-esm.com/ssr-base/)：基础 SSR 示例，快速上手。
- [ssr-html](https://www.gez-esm.com/ssr-html/)：纯 HTML SSR 示例，简单直观。
- [ssr-preact-htm](https://www.gez-esm.com/ssr-preact-htm/)：使用 Preact 和 HTM 的 SSR 示例。
- [ssr-vue2-host](https://www.gez-esm.com/ssr-vue2-host/)：Vue2 主机应用的 SSR 示例。
- [ssr-vue2-remote](https://www.gez-esm.com/ssr-vue2-remote/)：Vue2 远程应用的 SSR 示例。
- [ssr-vue3](https://www.gez-esm.com/ssr-vue3/)：Vue3 的 SSR 示例，体验最新技术。

## 💻 开发
```bash
# 克隆代码
git clone git@github.com:dp-os/gez.git
# 安装依赖
pnpm install
# 编译代码
pnpm build
# 进入示例项目
cd examples/项目
# 本地开发启动
pnpm run dev
```
## 😊 许可证
[MIT](./LICENSE)
