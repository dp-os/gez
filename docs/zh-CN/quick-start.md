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
## TS的支持
Genesis 默认提供了完整的TS开箱即用的能力，如果你不使用TS，将文档中的TS代码，修改成JS即可。
## Express
因为 `Genesis` 不具备创建 HTTP 服务的能力，所以这里我们还需要安装 `Express` 。如果你选择了其它的框架，可以跳过这一步，并且将例子中的代码，转换成对应框架的代码即可
```bash
npm install express
# 安装相关TS的类型库
npm install @types/express -D
```
## 例子实现
下面将会实现一个最基础的 SSR 项目，它会使用到三个核心概念 `SSR`、`Build`、`Renderer`    
在你的项目根目录创建下面四个文件，当然了你也可以使用其它的文件名字
```bash
touch genesis.ts genesis.dev.ts genesis.prod.ts genesis.build.ts tsconfig.json tsconfig.node.json
```
```
.
├── genesis.ts          // 核心业务逻辑入口
├── genesis.build.ts    // 编译生产环境代码
├── genesis.dev.ts      // dev环境启动入口
├── genesis.prod.ts     // 生产环境启动入口
├── tsconfig.json       // TS的配置文件
├── tsconfig.node.json  // TS node的配置文件
└── package.json
```
### genesis.ts
```ts
import { Renderer, SSR } from '@fmfe/genesis-core';
import express from 'express';

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
     * 请求进来，渲染html
     */
    app.get('*', async (req, res, next) => {
        try {
            const result = await renderer.renderHtml({ req, res });
            res.send(result.data);
        } catch (e) {
            next(e);
        }
    });
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
        "noEmit": false,
        "noUnusedLocals": true,
        "skipLibCheck": true,
        "noImplicitAny": false,
        "resolveJsonModule": true,
        "baseUrl": "./",
        "declaration": true,
        "declarationDir": "./types",
        "types": [
            "@types/node"
        ],
        "allowSyntheticDefaultImports": true
    }
}
```
这是一份公共的TS配置
### tsconfig.node.json
```json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "sourceMap": false,
        "noEmit": false,
        "target": "ES2018",
        "module": "CommonJS",
        "moduleResolution": "node",
        "allowSyntheticDefaultImports": true,
        "declaration": false,
        "declarationDir": null,
        "esModuleInterop": true,
        "outDir": "./dist"
    },
    "exclude": [
        "src",
        "dist",
        "types"
    ]
}
```
这是`node`环境运行时使用的TS配置
### package.json
```json
{
  "scripts": {
        "dev": "genesis-ts-node --project=./tsconfig.node.json genesis.dev",
        "build": "rm -rf dist types && npm run build:dts && npm run build:vue && npm run build:node",
        "build:node": "NODE_ENV=production genesis-tsc --build tsconfig.node.json",
        "build:vue": "NODE_ENV=production genesis-ts-node --project=./tsconfig.node.json genesis.build",
        "build:dts": "genesis-vue-tsc --declaration --emitDeclarationOnly",
        "type-check": "genesis-vue-tsc --noEmit",
        "start": "NODE_ENV=production node dist/genesis.prod"
  }
}
```
```bash
# 开发环境启动
npm run dev
# 打包生产环境
npm run build
# 编译Node环境代码
npm run build:node
# 编译Vue环境代码
npm run build:vue
# 编译项目的TS类型文件
npm run build:dts
# 执行项目的类型检查
npm run type-check
# 生产环境运行
npm run start
```
`@fmfe/genesis-compiler`封装了`genesis-tsc`、`genesis-ts-node`、`genesis-vue-tsc`三个命令，你可以快速的创建TS项目。如果你使用了`Webpack module federation`，`genesis-vue-tsc`创建的类型文件，还可以提供给其它的服务使用

将常用命令添加到 `npm script` 中，可以让我们各个快速的启动应用   
执行 `npm run dev`命令，在浏览器中访问 `http://localhost:3000`
## 能力拓展
Genesis 具备完整的构建`CSR`、`SSR`、`SSG`项目的能力，并且可以支持`Webpack module federation`，构建大型项目的能力，提供了`Webpack module federation`完整的TS类型支持的能力。

