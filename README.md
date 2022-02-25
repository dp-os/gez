<img src="./logo.svg" width="120">    

# Genesis


[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)

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

### 命令说明
- 安装项目依赖 `yarn bootstrap`
- 编译核心依赖 `yarn build:packages`
- 例子运行开发 `yarn dev`
- 例子编译生产 `yarn build`
- 例子运行生产 `yarn start`
- 例子类型检查 `yarn type-check`
- 代码风格检查 `yarn lint`