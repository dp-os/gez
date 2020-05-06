[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)

## 快速开发
```bash
yarn
yarn dev # 开发
yarn build # 构建生产包
yarn start # 运行生产包
# open http://localhost:3000
```

[Genesis 文档](https://fmfe.github.io/genesis-docs/)

## 核心库说明
|核心库|版本号|下载量|说明|
|:-|:-:|:-|:-|
|[genesis-core](https://www.npmjs.com/package/@fmfe/genesis-core)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)|提供基础的插件机制、SSR渲染逻辑、程序配置|
|[genesis-compiler](https://www.npmjs.com/package/@fmfe/genesis-compiler)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler)|负责编译程序以及在开发时编译，处理webpack的核心逻辑|
|[genesis-app](https://www.npmjs.com/package/@fmfe/genesis-app)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app)|快速创建应用，包装了 vue-router ，在微前端应用时支持多个 Router实例时特别有用|
|[genesis-remote](https://www.npmjs.com/package/@fmfe/genesis-remote)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote)|远程组件，实现微前端的核心依赖|
|[genesis-lint](https://www.npmjs.com/package/@fmfe/genesis-lint)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint)|一个 eslint 规范的集成|
|[square](https://www.npmjs.com/package/@fmfe/square)|[![npm](https://img.shields.io/npm/v/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square) |[![npm](https://img.shields.io/npm/dm/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square)|对TS友好的状态管理库|