<p align="center">
  <img src="https://www.gez-esm.com/logo.svg" width="180" alt="Gez Logo" />
</p>

<h1 align="center">Gez</h1>
<p align="center">🚀 基于 ESM 的高性能微前端框架</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gez/core"><img src="https://img.shields.io/npm/v/@gez/core.svg" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@gez/core"><img src="https://img.shields.io/npm/dm/@gez/core.svg" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@gez/core"><img src="https://img.shields.io/npm/dt/@gez/core.svg" alt="npm"></a>
</p>

<p align="center">
  <a href="https://www.gez-esm.com">Gez</a> 基于 <a href="https://rspack.dev/">Rspack</a> 编译，通过 <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap">importmap</a> 将模块映射到具有强缓存、基于内容哈希的 URL 中。
</p>

<p align="center">
  📚 <b>文档：</b><a href="https://www.gez-esm.com">https://www.gez-esm.com</a>
</p>

## 🌈 设计理念

- **基础服务**：设计统一的基础服务，提供所有第三方依赖
- **依赖管理**：基础服务统一维护依赖更新，一次发布全局生效
- **业务解耦**：业务服务专注于业务代码，依赖指向基础服务

## ✨ 核心特性

### 🚀 高性能构建
- 基于 [Rspack](https://rspack.dev/) 构建
- 提供开箱即用的构建配置
- 专注于 ESM 模块构建

### 🎯 依赖管理
- 中心化依赖管理
- 一次构建，多服务生效
- 运行时按需加载

### ☁️ SSR 能力
- 支持 Vue2、Vue3、React 等主流框架
- 提供完整的 SSR 解决方案
- 灵活的渲染策略配置

### 🔧 开发支持
- 支持 Node22.6
- 支持 [ESM dynamic import](https://caniuse.com/es6-module-dynamic-import)
- 支持 [import.meta](https://caniuse.com/mdn-javascript_operators_import_meta)

## 📖 示例项目

<table>
<tr>
<td align="center" width="50%">
  <a href="https://www.gez-esm.com/ssr-vue3/">
    <b>Vue3 SSR</b>
    <br />
    现代化 Vue3 开发示例
  </a>
</td>
<td align="center" width="50%">
  <a href="https://www.gez-esm.com/ssr-html/">
    <b>纯 HTML</b>
    <br />
    轻量级 SSR 方案
  </a>
</td>
</tr>
</table>

### 更多示例
- [Vue2 主应用](https://www.gez-esm.com/ssr-vue2-host/) - 微前端架构的主应用示例
- [Vue2 子应用](https://www.gez-esm.com/ssr-vue2-remote/) - 微前端架构的子应用示例
- [Preact + HTM](https://www.gez-esm.com/ssr-preact-htm/) - 轻量级框架的 SSR 实现

## 🚀 快速开始

```bash
# 克隆代码
git clone git@github.com:dp-os/gez.git

# 安装依赖
pnpm install

# 编译代码
pnpm build

# 运行示例
cd examples/ssr-vue3
pnpm run dev
```

## 📚 版本说明

- [v3.x](https://www.gez-esm.com) - 开发阶段
  > **注意**：当前版本存在以下已知问题：
  > - `modern-module` 的 `export *` 输出不稳定 ([#8557](https://github.com/web-infra-dev/rspack/issues/8557), [#8546](https://github.com/web-infra-dev/rspack/issues/8546))
  > - 动态导入模块依赖提升问题 ([#8736](https://github.com/web-infra-dev/rspack/issues/8736))

- [v2.x](https://github.com/dp-os/gez/blob/v2/docs/zh-CN/README.md) - 稳定维护中
- [v1.x](https://fmfe.github.io/genesis-docs/guide/) - 已停止维护（原名 Genesis）

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证。
