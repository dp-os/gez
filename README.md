[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)

[![Architecture diagram](https://fmfe.github.io/genesis-docs/renderer.jpg?v=1)](https://fmfe.github.io/genesis-docs/guide/renderer.html)

## What is Genesis?
- It is only a rendering Library Based on Vue SSR. It provides four rendering modes: `ssr-html`, `ssr-json`, `csr-html` and `csr-json`.    
- `HTML` rendering mode, can improve the first screen rendering speed and more SEO friendly.
- `JSON` rendering mode can be provided to `Vue`,`ejs`,`react`, etc. for server-side rendering or client-side rendering.
- Microservices provide API interfaces through the `JSON` rendering mode. Whether it is a micro front end or a microservice, other services can render the results.

## Quick start
```bash
yarn
yarn dev # development
yarn build # Build production package
yarn start # Run production package
# open http://localhost:3000
```

## Document
[简体中文](https://fmfe.github.io/genesis-docs/guide/)| [English](https://anish2690.github.io/genesis-docs-en/)


## Codesandbox
- [vue-genesis-template](https://codesandbox.io/s/condescending-architecture-ifgpt) 一个最基础简单的例子

## Demo
- [vue-genesis-template](https://github.com/fmfe/vue-genesis-template) 从零创建 SSR 项目
- [genesis-router-demo](https://github.com/fmfe/genesis-router-demo) 使用了 vue-router 的 demo
- [vue-genesis-micro](https://github.com/fmfe/vue-genesis-micro) 实现微前端、微服务聚合的 demo
- [vue2-demo](https://github.com/lzxb/vue2-demo) 使用了 vuex、vue-router 的demo

## Core library description
|核心库|版本号|下载量|说明|
|:-|:-:|:-|:-|
|[genesis-core](https://fmfe.github.io/genesis-docs/core/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)|提供基础的插件机制、SSR渲染逻辑、程序配置|
|[genesis-compiler](https://fmfe.github.io/genesis-docs/compiler/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler)|仅限开发环境使用，负责编译程序以及在开发时编译，处理webpack的核心逻辑|
|[genesis-app](https://fmfe.github.io/genesis-docs/app/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app)|快速创建应用，包装了 vue-router ，在微前端应用时支持多个 Router实例时特别有用|
|[genesis-remote](https://fmfe.github.io/genesis-docs/remote/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote)|远程组件，实现微服务的核心依赖|
|[square](https://www.npmjs.com/package/@fmfe/square)|[![npm](https://img.shields.io/npm/v/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square) |[![npm](https://img.shields.io/npm/dm/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square)|一个为了微模块设计的状态管理库|
|[genesis-lint](https://www.npmjs.com/package/@fmfe/genesis-lint)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint)|一个代码规范的集成，包含了eslint和stylelint| 

## Which companies use it
- [FOLLOWME5.0](https://www.followme.com/)
