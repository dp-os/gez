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
- [中文文档](./docs/zh-CN/README.md)
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