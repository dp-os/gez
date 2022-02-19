[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
# Genesis
一个基于Webpack module federation的轻量级Vue SSR框架

### 优势
- 编写简单的JS，就可以创建一个SSR项目
- 基础灵活的API，可以在此基础上封装自己的框架
- 开发依赖和生产依赖分包，在构建生产包时，应用更小化
- 支持Webpack module federation的SSR解决方案
- 支持TypeScript，开箱即用
- 长期维护更新

## 快速开始
```bash
# 创建目录
mkdir ssr-demo
# 移动到项目目录
cd ssr-demo
# 初始化项目信息
yarn init
# 安装生产依赖
yarn add @fmfe/genesis-core express
# 安装开发依赖
yarn add @fmfe/genesis-compiler
```
## 快速开发
```bash
git clone git@github.com:fmfe/genesis.git
cd genesis

# 安装依赖
lerna bootstrap

# 编译 genesis核心库
yarn build
# 编译例子，生成相关的dts类型文件，避免TS报错
yarn example:build:dts
# 启动例子，浏览器打开: http://localhost:3000
yarn example:dev

# 例子构建生产代码运行
yarn example:build:dts # 生产类型文件
yarn example:build # 编译代码
yarn example:start # 运行刚编译的代码

```
