[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)

[![架构图](https://fmfe.github.io/genesis-docs/renderer.jpg?v=1)](https://fmfe.github.io/genesis-docs/guide/renderer.html)

## Genesis 是什么？
- 它只是一个基于 Vue SSR 的渲染库，它提供了 `ssr-html`、`ssr-json`、`csr-html`、`csr-json`  四种的渲染模式。    
- `HTML` 渲染模式，可以提升首屏的渲染速度以及对 SEO 更加的友好。
- `JSON` 渲染模式，可以提供给 `Vue`、 `EJS`、`React` 等等，进行服务端渲染或者客户端渲染。
- `微架构` 通过 `JSON` 渲染模式，提供 API 接口，不管是微前端，还是微服务，都可以让其它服务对结果进行渲染。

## 快速开发
```bash
yarn
yarn dev # 开发
yarn build # 构建生产包
yarn start # 运行生产包
# open http://localhost:3000
```

## 文档
- [文档入口](https://fmfe.github.io/genesis-docs/)
- [快速开始](https://fmfe.github.io/genesis-docs/guide/)


## Codesandbox
- [vue-genesis-template](https://codesandbox.io/s/condescending-architecture-ifgpt) 一个最基础简单的例子

## demo
- [vue-genesis-template](https://github.com/fmfe/vue-genesis-template) 从零创建 SSR 项目
- [genesis-router-demo](https://github.com/fmfe/genesis-router-demo) 使用了 vue-router 的 demo
- [vue-genesis-micro](https://github.com/fmfe/vue-genesis-micro) 实现微前端、微服务聚合的 demo
- [vue2-demo](https://github.com/lzxb/vue2-demo) 使用了 vuex、vue-router 的demo

## 核心库说明
|核心库|版本号|下载量|说明|
|:-|:-:|:-|:-|
|[genesis-core](https://fmfe.github.io/genesis-docs/core/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)|提供基础的插件机制、SSR渲染逻辑、程序配置|
|[genesis-compiler](https://fmfe.github.io/genesis-docs/compiler/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler)|仅限开发环境使用，负责编译程序以及在开发时编译，处理webpack的核心逻辑|
|[genesis-app](https://fmfe.github.io/genesis-docs/app/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app)|快速创建应用，包装了 vue-router ，在微前端应用时支持多个 Router实例时特别有用|
|[genesis-remote](https://fmfe.github.io/genesis-docs/remote/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote)|远程组件，实现微前端的核心依赖|
|[square](https://www.npmjs.com/package/@fmfe/square)|[![npm](https://img.shields.io/npm/v/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square) |[![npm](https://img.shields.io/npm/dm/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square)|一个为了微模块设计的状态管理库|
|[genesis-lint](https://www.npmjs.com/package/@fmfe/genesis-lint)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint)|一个代码规范的集成，包含了eslint和stylelint| 

## 有哪些公司在使用
- [FOLLOWME5.0](https://www.followme.com/)
