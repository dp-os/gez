<img src="./logo.svg" width="120">    

# Genesis


[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)  
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥  
[🔥Support module Federation version🔥](https://github.com/fmfe/genesis/tree/feat-webpack5)  
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥  

一个简单而强大的Vue SSR框架

## 🚀 优势
- ✨ 编写简单的JS，就可以创建一个`SSR`项目    
- 🍀 基础灵活的API，可以在此基础上二次封装
- 🙅 开发依赖和生产依赖分包，在构建生产包时，应用更小化    
- 🤝 支持`Webpack module federation`
- 👍 支持`TypeScript`，生成`dts`和类型检查，开箱即用    
- 🛠 长期维护更新    

## 📚 文档
- [快速开始](./docs/zh-CN/quick-start.md)
    - [TS的支持](./docs/zh-CN/quick-start.md#TS的支持)
    - [Express](./docs/zh-CN/quick-start.md#express)
    - [例子实现](./docs/zh-CN/quick-start.md#例子实现)
      - [genesis.ts](./docs/zh-CN/quick-start.md#genesists)
      - [genesis.build.ts](./docs/zh-CN/quick-start.md#genesisbuildts)
      - [genesis.dev.ts](./docs/zh-CN/quick-start.md#genesisdevts)
      - [genesis.prod.ts](./docs/zh-CN/quick-start.md#genesisprodts)
      - [tsconfig.json](./docs/zh-CN/quick-start.md#tsconfigjson)
      - [tsconfig.node.json](./docs/zh-CN/quick-start.md#tsconfignodejson)
      - [package.json](./docs/zh-CN/quick-start.md#packagejson)
    - [全部的能力](./docs/zh-CN/quick-start.md#全部的能力)
- [管理HTML元数据](./docs/zh-CN/vue-meta.md)
    - [安装依赖](./docs/zh-CN/vue-meta.md#安装依赖)
    - [快速使用](./docs/zh-CN/vue-meta.md#快速使用)
    - [模板写入元数据](./docs/zh-CN/vue-meta.md#模板写入元数据)
    - [模板读取元数据](./docs/zh-CN/vue-meta.md#模板读取元数据)
- [@fmfe/genesis-core](./packages/genesis-core/README.md)
- [@fmfe/genesis-compiler](./packages/genesis-compiler/README.md)
- [@fmfe/genesis-app](./packages/genesis-app/README.md)
- [@fmfe/square](./packages/square/README.md)
- [@fmfe/genesis-lint](./packages/genesis-lint/README.md)
## 💻 本地开发
```bash
git clone git@github.com:fmfe/genesis.git
cd genesis

yarn bootstrap
yarn build:packages
yarn dev
```

## Document
[简体中文](https://fmfe.github.io/genesis-docs/guide/)| [English](https://anish2690.github.io/genesis-docs-en/)


## Codesandbox
- [vue-genesis-template](https://codesandbox.io/s/condescending-architecture-ifgpt) A very basic and simple example

## Demo
- [vue-genesis-template](https://github.com/fmfe/vue-genesis-template) Create SSR project from zero
- [genesis-router-demo](https://github.com/fmfe/genesis-router-demo) A demo of using Vue router
- [vue-genesis-micro](https://github.com/fmfe/vue-genesis-micro) A demo for microservice aggregation
- [vue2-demo](https://github.com/lzxb/vue2-demo) A demo of using vuex and Vue router

## Core library description
|Library|Version|Downloads|Explain|
|:-|:-:|:-|:-|
|[genesis-core](https://fmfe.github.io/genesis-docs/core/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)|Provides basic plug-in mechanism, SSR rendering logic and program configuration|
|[genesis-compiler](https://fmfe.github.io/genesis-docs/compiler/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler)|Can only be used in the development environment. It compiles the program, and handles the webpack's core logic|
|[genesis-app](https://fmfe.github.io/genesis-docs/app/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app)|Quickly create applications and wrap `vue-router`|
|[genesis-remote](https://fmfe.github.io/genesis-docs/remote/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote)|Remote components to implement the core dependency of microservices|
|[square](https://www.npmjs.com/package/@fmfe/square)|[![npm](https://img.shields.io/npm/v/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square) |[![npm](https://img.shields.io/npm/dm/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square)|A state management library designed for micro modules|
|[genesis-lint](https://www.npmjs.com/package/@fmfe/genesis-lint)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint)|A code guideline includes eslint and stylelint| 
