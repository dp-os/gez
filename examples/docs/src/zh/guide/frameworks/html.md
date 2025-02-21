---
titleSuffix: Gez 框架 HTML SSR 应用示例
description: 从零开始搭建基于 Gez 的 HTML SSR 应用，通过实例展示框架的基本用法，包括项目初始化、HTML 配置和入口文件设置。
head:
  - - meta
    - property: keywords
      content: Gez, HTML, SSR应用, TypeScript配置, 项目初始化, 服务端渲染, 客户端交互
---

# HTML

本教程将帮助你从零开始搭建一个基于 Gez 的 HTML SSR 应用。我们将通过一个完整的示例来展示如何使用 Gez 框架创建服务端渲染应用。

## 项目结构

首先，让我们了解项目的基本结构：

```bash
.
├── package.json         # 项目配置文件，定义依赖和脚本命令
├── tsconfig.json        # TypeScript 配置文件，设置编译选项
└── src                  # 源代码目录
    ├── app.ts           # 主应用组件，定义页面结构和交互逻辑
    ├── create-app.ts    # 应用实例创建工厂，负责初始化应用
    ├── entry.client.ts  # 客户端入口文件，处理浏览器端渲染
    └── entry.server.ts  # 服务端入口文件，处理 SSR 渲染逻辑
```

## 项目配置

### package.json

创建 `package.json` 文件，配置项目依赖和脚本：

```json
{
  "name": "ssr-demo-html",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "gez dev",
    "build": "npm run build:dts && npm run build:ssr",
    "build:ssr": "gez build",
    "preview": "gez preview",
    "start": "NODE_ENV=production node dist/index.js",
    "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src"
  },
  "dependencies": {
    "@gez/core": "*"
  },
  "devDependencies": {
    "@gez/rspack": "*",
    "@types/node": "22.8.6",
    "typescript": "^5.7.3"
  }
}
```

创建完 `package.json` 文件后，需要安装项目依赖。你可以使用以下任一命令来安装：
```bash
pnpm install
# 或
yarn install
# 或
npm install
```

这将安装所有必需的依赖包，包括 TypeScript 和 SSR 相关的依赖。

### tsconfig.json

创建 `tsconfig.json` 文件，配置 TypeScript 编译选项：

```json
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "node",
        "isolatedModules": true,
        "resolveJsonModule": true,
        
        "target": "ESNext",
        "lib": ["ESNext", "DOM"],
        
        "strict": true,
        "skipLibCheck": true,
        "types": ["@types/node"],
        
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        
        "baseUrl": ".",
        "paths": {
            "ssr-demo-html/src/*": ["./src/*"],
            "ssr-demo-html/*": ["./*"]
        }
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules"]
}
```

## 源码结构

### app.ts

创建主应用组件 `src/app.ts`，实现页面结构和交互逻辑：

```ts
/**
 * @file 示例组件
 * @description 展示一个带有自动更新时间的页面标题，用于演示 Gez 框架的基本功能
 */

export default class App {
    /**
     * 当前时间，使用 ISO 格式
     * @type {string}
     */
    public time = '';

    /**
     * 创建应用实例
     * @param {ServerContext} [serverContext] - 服务端上下文，包含导入元数据集合
     */
    public constructor(public serverContext?: ServerContext) {
        // 构造函数中不需要额外初始化
    }

    /**
     * 渲染页面内容
     * @returns {string} 返回页面 HTML 结构
     */
    public render(): string {
        // 确保在服务端环境下正确收集导入元数据
        if (this.serverContext) {
            this.serverContext.importMetaSet.add(import.meta);
        }

        return `
        <div id="app">
            <h1><a href="https://www.gez-esm.com/guide/frameworks/html.html" target="_blank">Gez 快速开始</a></h1>
            <time datetime="${this.time}">${this.time}</time>
        </div>
        `;
    }

    /**
     * 客户端初始化
     * @throws {Error} 当找不到时间显示元素时抛出错误
     */
    public onClient(): void {
        // 获取时间显示元素
        const time = document.querySelector('#app time');
        if (!time) {
            throw new Error('找不到时间显示元素');
        }

        // 设置定时器，每秒更新一次时间
        const updateTime = () => {
            const now = new Date().toISOString();
            this.time = now;
            time.textContent = now;
            time.setAttribute('datetime', now);
        };

        // 初始化时间并启动定时器
        updateTime();
        setInterval(updateTime, 1000);
    }

    /**
     * 服务端初始化
     */
    public onServer(): void {
        // 设置初始时间
        this.time = new Date().toISOString();
    }
}
```

### create-app.ts

创建 `src/create-app.ts` 文件，负责创建应用实例：

```ts
/**
 * @file 应用实例创建
 * @description 负责创建和配置应用实例
 */

import App from './app';

export function createApp() {
    const app = new App();
    return {
        app
    };
}
```

### entry.client.ts

创建客户端入口文件 `src/entry.client.ts`：

```ts
/**
 * @file 客户端入口文件
 * @description 负责客户端交互逻辑和动态更新
 */

import { createApp } from './create-app';

// 创建应用实例并初始化
const { app } = createApp();
app.onClient();
```

### entry.server.ts

创建服务端渲染入口文件 `src/entry.server.ts`：

```ts
/**
 * @file 服务端渲染入口文件
 * @description 负责服务端渲染流程、HTML 生成和资源注入
 */

import type { RenderContext } from '@gez/core';
import type { ServerContext } from './app';
import { createApp } from './create-app';

// 封装页面内容生成逻辑
const renderToString = (serverContext: ServerContext): string => {
    // 创建应用实例
    const { app } = createApp();

    app.serverContext = serverContext;
    // 初始化服务端
    app.onServer();

    // 生成页面内容
    return app.render();
};

export default async (rc: RenderContext) => {
    // 使用 renderToString 生成页面内容
    const html = renderToString({
        importMetaSet: rc.importMetaSet
    });

    // 提交依赖收集，确保所有必要资源都被加载
    await rc.commit();

    // 生成完整的 HTML 结构
    rc.html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    ${rc.preload()}
    <title>Gez 快速开始</title>
    ${rc.css()}
</head>
<body>
    ${html}
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>
`;
};
```

## 运行项目

完成上述文件配置后，你可以使用以下命令来运行项目：

1. 开发模式：
```bash
npm run dev
```

2. 构建项目：
```bash
npm run build
```

3. 生产环境运行：
```bash
npm run start
```

现在，你已经成功创建了一个基于 Gez 的 HTML SSR 应用！访问 http://localhost:3000 即可看到效果。
