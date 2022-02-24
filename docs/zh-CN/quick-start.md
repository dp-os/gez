# 快速开始
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
## 创建文件
### genesis.js
创建`ssr`、`app`实例和`startApp`方法
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
/**
 * 创建服务器
 */
const app = express();



/**
 * 程序启动
 * @param {Renderer} renderer 
 */
function startApp(renderer) {
     /**
      * 监听请求，执行渲染程序
      */
     app.get(async (req, res, next) => {
          const result = await renderer.renderHtml({ req, res });
          res.send(result.data);
     });
     /**
      * 监听3000端口
      */
     app.listen(3000, () => console.log(`http://localhost:3000`));
}

exports.ssr = ssr;
exports.app = app;
exports.startApp = startApp;
```
### genesis.dev.js
开发时程序启动，执行命令：`node genesis.dev`
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
构建生产应用代码，执行命令：`NODE_ENV=production node genesis.build`，编译内容将会输出在`dist`目录里面
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
执行编译完成后的代码，执行命令：`NODE_ENV=production node genesis.prod`
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
## 命令封装
为了简化执行命令，可以在`package.json`封装    
开发：`npm run dev`    
编译：`npm run build`     
生产：`npm run start`     
```json
{
  "scripts": {
    "dev": "node genesis.dev",
    "build": "NODE_ENV=production node genesis.build",
    "start": "NODE_ENV=production node genesis.prod"
  }
}
```
## 启动程序
运行：`npm run dev`    
打开：`http://localhost:3000`    
