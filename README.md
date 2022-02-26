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
  - [SSR 选项](./docs/zh-CN/ssr-options.md#选项)
    - [name](./docs/zh-CN/ssr-options.md#name)
    - [isProd](./docs/zh-CN/ssr-options.md#isprod)
    - [cdnPublicPath](./docs/zh-CN/ssr-options.md#cdnpublicpath)
    - [sandboxGlobal](./docs/zh-CN/ssr-options.md#sandboxglobal)
    - [build.extractCSS](./docs/zh-CN/ssr-options.md#buildextractcss)
    - [build.baseDir](./docs/zh-CN/ssr-options.md#buildbasedir)
    - [build.transpile](./docs/zh-CN/ssr-options.md#buildtranspile)
    - [build.alias](./docs/zh-CN/ssr-options.md#buildalias)
    - [build.fallback](./docs/zh-CN/ssr-options.md#buildfallback)
    - [build.template](./docs/zh-CN/ssr-options.md#buildtemplate)
    - [build.target](./packages/genesis-core/README.md#buildtarget)
  - [SSR 实例](./docs/zh-CN/ssr-instance.md#ssr)
    - [属性](./docs/zh-CN/ssr-instance.md#%E5%B1%9E%E6%80%A7)
      - [Renderer](./docs/zh-CN/ssr-instance.md#renderer)
      - [options](./docs/zh-CN/ssr-instance.md#options)
      - [plugin](./docs/zh-CN/ssr-instance.md#plugin)
      - [entryName](./docs/zh-CN/ssr-instance.md#entryname)
      - [sandboxGlobal](./docs/zh-CN/ssr-instance.md#sandboxglobal)
      - [isProd](./docs/zh-CN/ssr-instance.md#isprod)
      - [name](./docs/zh-CN/ssr-instance.md#name)
      - [extractCSS](./docs/zh-CN/ssr-instance.md#extractcss)
      - [publicPath](./docs/zh-CN/ssr-instance.md#publicpath)
      - [publicPathVarName](./docs/zh-CN/ssr-instance.md#publicpathvarname)
      - [cdnPublicPath](./docs/zh-CN/ssr-instance.md#cdnpublicpath)
      - [baseDir](./docs/zh-CN/ssr-instance.md#basedir)
      - [outputDir](./docs/zh-CN/ssr-instance.md#outputdir)
      - [outputDirInTemplate](./docs/zh-CN/ssr-instance.md#outputdirintemplate)
      - [outputDirInClient](./docs/zh-CN/ssr-instance.md#outputdirinclient)
      - [outputDirInServer](./docs/zh-CN/ssr-instance.md#outputdirinserver)
      - [srcDir](./docs/zh-CN/ssr-instance.md#srcdir)
      - [srcIncludes](./docs/zh-CN/ssr-instance.md#srcincludes)
      - [transpile](./docs/zh-CN/ssr-instance.md#transpile)
      - [entryClientFile](./docs/zh-CN/ssr-instance.md#entryclientfile)
      - [entryServerFile](./docs/zh-CN/ssr-instance.md#entryserverfile)
      - [outputClientManifestFile](./docs/zh-CN/ssr-instance.md#outputclientmanifestfile)
      - [outputServeAppFile](./docs/zh-CN/ssr-instance.md#outputserveappfile)
      - [templateFile](./docs/zh-CN/ssr-instance.md#templatefile)
      - [outputTemplateFile](./docs/zh-CN/ssr-instance.md#outputtemplatefile)
    - [方法](./docs/zh-CN/ssr-instance.md#%E6%96%B9%E6%B3%95)
      - [getBuildTarget](./docs/zh-CN/ssr-instance.md#getbuildtarget)
      - [createRenderer](./docs/zh-CN/ssr-instance.md#createrenderer)
- [@fmfe/genesis-compiler](./packages/genesis-compiler/README.md) TODO
- [@fmfe/genesis-app](./packages/genesis-app/README.md) TODO
- [@fmfe/square](./packages/square/README.md) TODO
- [@fmfe/genesis-lint](./packages/genesis-lint/README.md) TODO
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