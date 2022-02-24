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
yarn add @fmfe/genesis-compiler -D
# 创建启动文件
touch genesis.js genesis.dev.js genesis.prod.js genesis.build.js
```
### genesis.js
```javascript
const { SSR, Renderer } = require('@fmfe/genesis-core');
const express = require('express');

/**
 * 创建一个SSR的实例
 */
const ssr = new SSR({
     /**
      * 设置一个服务的名称
      */
     name: 'ssr-demo'
});
const app = express();



/**
 * 程序启动
 * @param {Renderer} renderer 
 */
function startApp(renderer) {
     exports.app.get(async (req, res, next) => {
          const result = await renderer.renderHtml();
          res.send(result.data);
     });
     app.use(renderer.renderMiddleware);

     app.listen(3000, () => console.log(`http://localhost:3000`));
}

exports.ssr = ssr;
exports.app = app;
exports.startApp = startApp;
```
### genesis.dev.js
```javascript
const { Watch } = require('@fmfe/genesis-compiler');
const { ssr, app, startApp } = require('./genesis');

const start = async () => {
    /**
     * 创建一个观察实例
     */
    const watch = new Watch(ssr);
    /**
     * 启动观察
     */
    await watch.start();
    /**
     * 拿到观察实例上对应的渲染器
     */
    const renderer = watch.renderer;

    /**
     * 静态资源中间件
     */
    app.use(watch.devMiddleware);
    /**
     * 热更新的中间件
     */
    app.use(watch.hotMiddleware);
    /**
     * 拿到渲染器后，启动应用程序
     */
    startApp(renderer);
};
start();
```

### genesis.build.js
```javascript
const { Build } = require('@fmfe/genesis-compiler');

const { ssr } = require('./genesis');

const start = () => {
    /**
     * 创建一个编译实例
     */
    const build = new Build(ssr);
    /**
     * 开始执行编译程序，构建生产环境应用包
     */
    return build.start();
};
start();

```

### genesis.prod.js
```javascript
const express = require('express');
const { app, ssr, startApp } = require('./genesis');

/**
 * 生产环境，应用程序我们已经编译好了，所以在这里可以直接创建一个渲染器
 */
const renderer = ssr.createRenderer();

/**
 * 生产环境，静态资源都是基于内容哈希生成的文件名，所以这里设置静态目录的时候，设置强缓存即可
 */
app.use(
    renderer.staticPublicPath,
    express.static(renderer.staticDir, {
        immutable: true,
        maxAge: '31536000000'
    })
);

/**
 * 启动应用
 */
startApp(renderer);

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
