---
titleSuffix: Gez 框架 Vue2 SSR 應用範例
description: 從零開始搭建基於 Gez 的 Vue2 SSR 應用，透過實例展示框架的基本用法，包括專案初始化、Vue2 配置和入口檔案設定。
head:
  - - meta
    - property: keywords
      content: Gez, Vue2, SSR應用, TypeScript配置, 專案初始化, 伺服器端渲染, 客戶端互動
---

# Vue2

本教學將幫助你從零開始搭建一個基於 Gez 的 Vue2 SSR 應用。我們將透過一個完整的範例來展示如何使用 Gez 框架建立伺服器端渲染應用。

## 專案結構

首先，讓我們了解專案的基本結構：

```bash
.
├── package.json         # 專案設定檔，定義依賴和指令碼命令
├── tsconfig.json        # TypeScript 設定檔，設定編譯選項
└── src                  # 原始碼目錄
    ├── app.vue          # 主應用元件，定義頁面結構和互動邏輯
    ├── create-app.ts    # Vue 實例建立工廠，負責初始化應用
    ├── entry.client.ts  # 客戶端入口檔案，處理瀏覽器端渲染
    ├── entry.node.ts    # Node.js 伺服器入口檔案，負責開發環境配置和伺服器啟動
    └── entry.server.ts  # 伺服器端入口檔案，處理 SSR 渲染邏輯
```

## 專案配置

### package.json

建立 `package.json` 檔案，配置專案依賴和指令碼：

```json title="package.json"
{
  "name": "ssr-demo-vue2",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "gez dev",
    "build": "npm run build:dts && npm run build:ssr",
    "build:ssr": "gez build",
    "preview": "gez preview",
    "start": "NODE_ENV=production node dist/index.js",
    "build:dts": "vue-tsc --declaration --emitDeclarationOnly --outDir dist/src"
  },
  "dependencies": {
    "@gez/core": "*"
  },
  "devDependencies": {
    "@gez/rspack-vue": "*",
    "@types/node": "22.8.6",
    "typescript": "^5.7.3",
    "vue": "^2.7.16",
    "vue-server-renderer": "^2.7.16",
    "vue-tsc": "^2.1.6"
  }
}
```

建立完 `package.json` 檔案後，需要安裝專案依賴。你可以使用以下任一命令來安裝：
```bash
pnpm install
# 或
yarn install
# 或
npm install
```

這將安裝所有必需的依賴套件，包括 Vue2、TypeScript 和 SSR 相關的依賴。

### tsconfig.json

建立 `tsconfig.json` 檔案，配置 TypeScript 編譯選項：

```json title="tsconfig.json"
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
            "ssr-demo-vue2/src/*": ["./src/*"],
            "ssr-demo-vue2/*": ["./*"]
        }
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules"]
}
```

## 原始碼結構

### app.vue

建立主應用元件 `src/app.vue`，使用 `<script setup>` 語法：

```html title="src/app.vue"
<template>
    <div id="app">
        <h1><a href="https://www.jsesm.com/guide/frameworks/vue2.html" target="_blank">Gez 快速開始</a></h1>
        <time :datetime="time">{{ time }}</time>
    </div>
</template>

<script setup lang="ts">
/**
 * @file 範例元件
 * @description 展示一個帶有自動更新時間的頁面標題，用於演示 Gez 框架的基本功能
 */

import { onMounted, onUnmounted, ref } from 'vue';

// 當前時間，每秒更新一次
const time = ref(new Date().toISOString());
let timer: NodeJS.Timeout;

onMounted(() => {
    timer = setInterval(() => {
        time.value = new Date().toISOString();
    }, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});
</script>
```

### create-app.ts

建立 `src/create-app.ts` 檔案，負責建立 Vue 應用實例：

```ts title="src/create-app.ts"
/**
 * @file Vue 實例建立
 * @description 負責建立和配置 Vue 應用實例
 */

import Vue from 'vue';
import App from './app.vue';

export function createApp() {
    const app = new Vue({
        render: (h) => h(App)
    });
    return {
        app
    };
}
```

### entry.client.ts

建立客戶端入口檔案 `src/entry.client.ts`：

```ts title="src/entry.client.ts"
/**
 * @file 客戶端入口檔案
 * @description 負責客戶端互動邏輯和動態更新
 */

import { createApp } from './create-app';

// 建立 Vue 實例
const { app } = createApp();

// 掛載 Vue 實例
app.$mount('#app');
```

### entry.node.ts

建立 `entry.node.ts` 檔案，配置開發環境和伺服器啟動：

```ts title="src/entry.node.ts"
/**
 * @file Node.js 伺服器入口檔案
 * @description 負責開發環境配置和伺服器啟動，提供 SSR 執行時環境
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * 配置開發環境的應用建立器
     * @description 建立並配置 Rspack 應用實例，用於開發環境的建構和熱更新
     * @param gez Gez 框架實例，提供核心功能和配置介面
     * @returns 返回配置好的 Rspack 應用實例，支援 HMR 和即時預覽
     */
    async devApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez, {
                config(context) {
                    // 在此處自訂 Rspack 編譯配置
                }
            })
        );
    },

    /**
     * 配置並啟動 HTTP 伺服器
     * @description 建立 HTTP 伺服器實例，整合 Gez 中介軟體，處理 SSR 請求
     * @param gez Gez 框架實例，提供中介軟體和渲染功能
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // 使用 Gez 中介軟體處理請求
            gez.middleware(req, res, async () => {
                // 執行伺服器端渲染
                const rc = await gez.render({
                    params: { url: req.url }
                });
                res.end(rc.html);
            });
        });

        server.listen(3000, () => {
            console.log('服務啟動: http://localhost:3000');
        });
    }
} satisfies GezOptions;
```

這個檔案是開發環境配置和伺服器啟動的入口檔案，主要包含兩個核心功能：

1. `devApp` 函式：負責建立和配置開發環境的 Rspack 應用實例，支援熱更新和即時預覽功能。這裡使用 `createRspackVue2App` 來建立專門用於 Vue2 的 Rspack 應用實例。
2. `server` 函式：負責建立和配置 HTTP 伺服器，整合 Gez 中介軟體處理 SSR 請求。


### entry.server.ts

建立伺服器端渲染入口檔案 `src/entry.server.ts`：

```ts title="src/entry.server.ts"
/**
 * @file 伺服器端渲染入口檔案
 * @description 負責伺服器端渲染流程、HTML 生成和資源注入
 */

import type { RenderContext } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

// 建立渲染器
const renderer = createRenderer();

export default async (rc: RenderContext) => {
    // 建立 Vue 應用實例
    const { app } = createApp();

    // 使用 Vue 的 renderToString 生成頁面內容
    const html = await renderer.renderToString(app, {
        importMetaSet: rc.importMetaSet
    });

    // 提交依賴收集，確保所有必要資源都被載入
    await rc.commit();

    // 生成完整的 HTML 結構
    rc.html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    ${rc.preload()}
    <title>Gez 快速開始</title>
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

## 執行專案

完成上述檔案配置後，你可以使用以下命令來執行專案：

1. 開發模式：
```bash
npm run dev
```

2. 建構專案：
```bash
npm run build
```

3. 生產環境執行：
```bash
npm run start
```

現在，你已經成功建立了一個基於 Gez 的 Vue2 SSR 應用！訪問 http://localhost:3000 即可看到效果。