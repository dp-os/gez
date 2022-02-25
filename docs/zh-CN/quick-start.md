# 快速开始
```bash
# 创建目录
mkdir ssr-demo
# 移动到项目目录
cd ssr-demo
# 初始化项目信息
npm init
# 安装生产依赖
npm install @fmfe/genesis-core
# 安装开发依赖
npm install @fmfe/genesis-compiler -D
```
## TS 运行时
文档内所有的例子都基于 `ts` 进行编写，关于如何在 `Node` 运行 `ts` ，请了解 [ts-node](https://github.com/TypeStrong/ts-node)。如果你不想使用 `ts`或者已安装，可以跳过这个步骤，只需要将文档的例子，修改成 `js` 语法即可
```bash
npm install ts-node typescript -g
```
## HTTP 服务
因为 `Genesis` 不具备创建 HTTP 服务的能力，所以这里我们还需要安装 `Express` 。如果你选择了其它的框架，可以跳过这一步，并且将例子中的代码，转换成对应框架的代码即可
```bash
npm install express
# 安装相关TS的类型库
npm install @types/express @types/node -D
```
## 例子实现
下面将会实现一个最基础的 SSR 项目，它会使用到三个核心概念 `SSR`、`Build`、`Renderer`
### 目录结构
在你的项目根目录创建下面四个文件，当然了你也可以使用其它的文件名字
```bash
touch genesis.ts genesis.dev.ts genesis.prod.ts genesis.build.ts tsconfig.json
```
```
.
├── genesis.ts       // 核心业务逻辑入口
├── genesis.build.ts // 编译生产环境代码
├── genesis.dev.ts   // dev环境启动入口
├── genesis.prod.ts  // 生产环境启动入口
├── tsconfig.json    // TS 的配置文件
└── package.json
```
### genesis.ts
```ts
import express from 'express';
import { SSR, Renderer } from '@fmfe/genesis-core';

/**
 * 创建一个应用程序
 */
export const app = express();

/**
 * 创建一个 SSR 实例
 */
export const ssr = new SSR();

/**
 * 拿到渲染器后，启动应用程序
 */
export const startApp = (renderer: Renderer) => {
    /**
     * 使用默认渲染中间件进行渲染，你也可以调用更加底层的 renderer.renderJson 和 renderer.renderHtml 来实现渲染
     */
    app.use(renderer.renderMiddleware);
    /**
     * 监听端口
     */
    app.listen(3000, () => console.log(`http://localhost:3000`));
};

```
开发环境和生产环境，共同的启动逻辑
### genesis.build.ts
```ts
import { Build } from '@fmfe/genesis-compiler';
import { ssr } from './genesis';

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
编译生产环境所需的代码
### genesis.dev.ts
```ts
import { Watch } from '@fmfe/genesis-compiler';
import { ssr, app, startApp } from './genesis';

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
开发环境，程序的启动入口
### genesis.prod.ts
```ts
import express from 'express';
import { ssr, app, startApp } from './genesis';

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
生产环境启动入口
### tsconfig.json
```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "experimentalDecorators": true,
        "allowJs": true,
        "sourceMap": true,
        "strict": true,
        "noEmit": true,
        "noUnusedLocals": true,
        "skipLibCheck": true,
        "noImplicitAny": false,
        "resolveJsonModule": true,
        "baseUrl": "./",
        "typeRoots": [
            "./types/*"
        ],
        "types": [
            "@types/node"
        ],
        "allowSyntheticDefaultImports": true
    },
    "ts-node": {
        "compilerOptions": {
            "target": "es2018",
            "module": "commonjs",
            "moduleResolution": "node",
            "allowSyntheticDefaultImports": true,
            "declaration": true,
            "esModuleInterop": true,
            "outDir": "../dist"
        }
    }
}
```
这里提供了一份常见的 ts 配置，你可以根据自己的需要进行调整
### package.json
```json
{
  "scripts": {
    "dev": "ts-node genesis.dev -p=tsconfig.json",
    "build": "rm -rf dist && NODE_ENV=production ts-node genesis.build -p=tsconfig.json",
    "start": "NODE_ENV=production ts-node genesis.prod -p=tsconfig.json"
  }
}
```
```bash
# 开发环境启动
npm run dev
# 打包生产环境代码
npm run build
# 生产环境运行
npm run start
```
将常用命令添加到 `npm script` 中，可以让我们各个快速的启动应用   
执行 `npm run dev`命令，在浏览器中访问 `http://localhost:3000`
