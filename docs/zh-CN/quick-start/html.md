# HTML
这是一个与框架无关的例子，采用原生的 HTML 来开发项目

## 创建项目
```bash
cd 项目目录
npm init
```
## 将项目设置为 module
在 **package.json** 文件添加
```json
{
    "type": "module"
}
```

## 安装依赖
```bash
# 安装生产依赖
npm install @gez/core
# 安装开发依赖
npm install @gez/rspack -D
```
## 添加脚本
在 **package.json** 文件添加
```json
{
  "scripts": {
    "dev": "gez dev",
    "build": "gez build",
    "start": "gez start",
    "preview": "gez preview",
    "postinstall": "gez install"
  }
}
```
## 入口文件
基本结构
```
- src/
  - entry.client.ts  # 客户端程序入口，一般会处理水合
  - entry.server.ts  # 使用框架的 SSR API 渲染出 HTML 内容
  - entry.node.ts    # 创建一个服务器程序，来处理请求
```
### src/entry.client.ts
模拟水合，更新当前时间
```ts
const time = document.querySelector('time');
setInterval(() => {
    time?.setHTMLUnsafe(new Date().toISOString());
}, 1000);

```
### src/entry.server.ts
模拟框架的 SSR API，渲染出 HTML 内容返回
```ts
// 这里必须使用 import type，否则开发阶段会报错
import type { ServerContext } from '@gez/core';

export default async (ctx: ServerContext, params: { url: string }) => {
    // 获取注入的代码
    const script = await ctx.getInjectScript();
    const time = new Date().toISOString();
    ctx.html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gez</title>
</head>
<body>
    <h1>Gez</h1>
    <h2>Hello world!</h2>
    <p>URL: ${params.url}</p>
    <time>${time}</time>
    ${script}
</body>
</html>
`;
};

```
### src/entry.node.ts
创建一个 web 服务器，来处理客户请求
```ts
import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    // 设置应用的唯一名字，如果有多个项目，则名字不能重复
    name: 'ssr-html',
    // 本地执行 dev 和 build 时会使用
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createApp(gez, (buildContext) => {
                // 可以在这里修改 Rspack 编译的配置
            })
        );
    },
    async createServer(gez) {
        const server = http.createServer((req, res) => {
            // 静态文件处理
            gez.middleware(req, res, async () => {
                // 传入渲染的参数
                const ctx = await gez.render({
                    url: req.url
                });
                // 响应 HTML 内容
                res.end(ctx.html);
            });
        });
        // 监听端口
        server.listen(3005, () => {
            console.log('http://localhost:3005');
        });
    }
} satisfies GezOptions;

```
### 启动项目
```bash
npm run dev
```
> 浏览器打开：http://localhost:3005