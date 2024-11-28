# Gez
[![npm](https://img.shields.io/npm/v/@gez/core.svg)](https://www.npmjs.com/package/@gez/core) 
[![npm](https://img.shields.io/npm/dm/@gez/core.svg)](https://www.npmjs.com/package/@gez/core)
[![npm](https://img.shields.io/npm/dt/@gez/core.svg)](https://www.npmjs.com/package/@gez/core)

[Gez](https://dp-os.github.io/gez/index.html) 基于 **[Rspack](https://rspack.dev/)** 编译，通过 **[importmap](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap)** 将模块映射到具有强缓存，基于内容哈希的 URL 中。
   
> **⚠️** 已知，Rspack 目前对 ESM 的热更新和 `export *` 支持不完整，并且在大型项目中有数十个 `entry` 导出的项目上热更新非常慢。

## 🌈 理念
- 我们应该设计一个基础服务，由基础服务提供所有的第三方依赖。
- 基础服务统一维护第三方依赖更新，一次发布，所有业务系统生效。
- 业务服务仅构建业务代码，所有的第三方依赖，应指向到基础服务中。

## ✨ 特性
- 👍 **技术创新**：首个基于 ESM 构建的 SSR 多服务模块链接。
- 🚀 **项目构建**：基于 Rspack 实现，构建速度极快，带给你极致的开发体验。
- 🎯 **依赖管理**：一次构建，一次发布，多服务生效。
- ☁️ **同构渲染**：支持 Vue2、Vue3、React 等不同框架实现 SSR。
- 😎 **基准支持**：Node22.9 和支持 [ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) 和 [import.meta](https://caniuse.com/mdn-javascript_operators_import_meta) 的浏览器。
- 👏 **长久维护**：[Genesis](https://www.npmjs.com/package/@fmfe/genesis-core) 从 2020 年迭代至今，现更名为 [Gez](https://dp-os.github.io/gez/index.html)。
- 🇨🇳 **中文文档**：中文是第一优先级的语言。

## 📚 文档
- [😎 v3.x 开发阶段](https://dp-os.github.io/gez/index.html)
- [😂 v2.x 持续维护](https://github.com/dp-os/gez/blob/v2/docs/zh-CN/README.md)
- [😖 v1.x 停止维护](https://fmfe.github.io/genesis-docs/guide/)

## 📖 例子
- [ssr-html](https://dp-os.github.io/gez/ssr-html/)
- [ssr-preact-htm](https://dp-os.github.io/gez/ssr-preact-htm/)
- [ssr-vue2-host](https://dp-os.github.io/gez/ssr-vue2-host/)
- [ssr-vue2-remote](https://dp-os.github.io/gez/ssr-vue2-remote/)
- [ssr-vue3](https://dp-os.github.io/gez/ssr-vue3/)

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
