[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)

## 快速开发
```bash
git clone git@github.com:fmfe/genesis.git
cd genesis

# 安装依赖
lerna bootstrap --registry=https://registry.npmmirror.com

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