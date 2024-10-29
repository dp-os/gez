# HTML
这是一个与框架无关的例子，采用原生的 HTML 来开发项目

## 创建项目
```bash
cd 项目目录
npm init
```
## 将项目设置为 module
在 **package.json** 文件添加如下
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
在 **package.json** 文件添加如下
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
import type { ServerContext } from '@gez/core';

export default async (ctx: ServerContext, params: { url: string }) => {
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
    name: 'ssr-html',
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) => m.createApp(gez));
    },
    async createServer(gez) {
        const server = http.createServer((req, res) => {
            gez.middleware(req, res, async () => {
                const ctx = await gez.render({
                    url: req.url
                });
                res.end(ctx.html);
            });
        });
        server.listen(3005, () => {
            console.log('http://localhost:3005');
        });
    }
} satisfies GezOptions;

```