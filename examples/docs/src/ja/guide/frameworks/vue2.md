---
titleSuffix: Gez フレームワーク Vue2 SSR アプリケーション例
description: Gez を使用して Vue2 SSR アプリケーションをゼロから構築する方法を紹介します。プロジェクトの初期化、Vue2 の設定、エントリーファイルの設定など、フレームワークの基本的な使い方を実例を通して説明します。
head:
  - - meta
    - property: keywords
      content: Gez, Vue2, SSRアプリケーション, TypeScript設定, プロジェクト初期化, サーバーサイドレンダリング, クライアントサイドインタラクション
---

# Vue2

このチュートリアルでは、Gez を使用して Vue2 SSR アプリケーションをゼロから構築する方法を説明します。Gez フレームワークを使用してサーバーサイドレンダリングアプリケーションを作成する方法を、完全な例を通して紹介します。

## プロジェクト構造

まず、プロジェクトの基本構造を確認しましょう：

```bash
.
├── package.json         # プロジェクト設定ファイル、依存関係とスクリプトコマンドを定義
├── tsconfig.json        # TypeScript 設定ファイル、コンパイルオプションを設定
└── src                  # ソースコードディレクトリ
    ├── app.vue          # メインアプリケーションコンポーネント、ページ構造とインタラクションロジックを定義
    ├── create-app.ts    # Vue インスタンス作成ファクトリ、アプリケーションの初期化を担当
    ├── entry.client.ts  # クライアントサイドエントリーファイル、ブラウザサイドレンダリングを処理
    ├── entry.node.ts    # Node.js サーバーエントリーファイル、開発環境設定とサーバー起動を担当
    └── entry.server.ts  # サーバーサイドエントリーファイル、SSR レンダリングロジックを処理
```

## プロジェクト設定

### package.json

`package.json` ファイルを作成し、プロジェクトの依存関係とスクリプトを設定します：

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

`package.json` ファイルを作成した後、プロジェクトの依存関係をインストールする必要があります。以下のいずれかのコマンドを使用してインストールできます：
```bash
pnpm install
# または
yarn install
# または
npm install
```

これにより、Vue2、TypeScript、SSR 関連の依存関係を含むすべての必要なパッケージがインストールされます。

### tsconfig.json

`tsconfig.json` ファイルを作成し、TypeScript のコンパイルオプションを設定します：

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

## ソースコード構造

### app.vue

メインアプリケーションコンポーネント `src/app.vue` を作成し、`<script setup>` 構文を使用します：

```html title="src/app.vue"
<template>
    <div id="app">
        <h1><a href="https://www.jsesm.com/guide/frameworks/vue2.html" target="_blank">Gez クイックスタート</a></h1>
        <time :datetime="time">{{ time }}</time>
    </div>
</template>

<script setup lang="ts">
/**
 * @file サンプルコンポーネント
 * @description Gez フレームワークの基本機能をデモンストレーションするための、自動更新される時間付きページタイトルを表示
 */

import { onMounted, onUnmounted, ref } from 'vue';

// 現在時刻、1秒ごとに更新
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

`src/create-app.ts` ファイルを作成し、Vue アプリケーションインスタンスの作成を担当します：

```ts title="src/create-app.ts"
/**
 * @file Vue インスタンス作成
 * @description Vue アプリケーションインスタンスの作成と設定を担当
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

クライアントサイドエントリーファイル `src/entry.client.ts` を作成します：

```ts title="src/entry.client.ts"
/**
 * @file クライアントサイドエントリーファイル
 * @description クライアントサイドインタラクションロジックと動的更新を担当
 */

import { createApp } from './create-app';

// Vue インスタンスを作成
const { app } = createApp();

// Vue インスタンスをマウント
app.$mount('#app');
```

### entry.node.ts

`entry.node.ts` ファイルを作成し、開発環境とサーバー起動を設定します：

```ts title="src/entry.node.ts"
/**
 * @file Node.js サーバーエントリーファイル
 * @description 開発環境設定とサーバー起動を担当し、SSR ランタイム環境を提供
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * 開発環境のアプリケーション作成を設定
     * @description Rspack アプリケーションインスタンスを作成し、開発環境のビルドとホットリロードをサポート
     * @param gez Gez フレームワークインスタンス、コア機能と設定インターフェースを提供
     * @returns 設定された Rspack アプリケーションインスタンスを返し、HMR とリアルタイムプレビューをサポート
     */
    async devApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez, {
                config(context) {
                    // ここで Rspack コンパイル設定をカスタマイズ
                }
            })
        );
    },

    /**
     * HTTP サーバーを設定して起動
     * @description HTTP サーバーインスタンスを作成し、Gez ミドルウェアを統合して SSR リクエストを処理
     * @param gez Gez フレームワークインスタンス、ミドルウェアとレンダリング機能を提供
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // Gez ミドルウェアを使用してリクエストを処理
            gez.middleware(req, res, async () => {
                // サーバーサイドレンダリングを実行
                const rc = await gez.render({
                    params: { url: req.url }
                });
                res.end(rc.html);
            });
        });

        server.listen(3000, () => {
            console.log('サーバー起動: http://localhost:3000');
        });
    }
} satisfies GezOptions;
```

このファイルは開発環境設定とサーバー起動のエントリーファイルで、以下の2つの主要な機能を含みます：

1. `devApp` 関数：開発環境の Rspack アプリケーションインスタンスを作成し、ホットリロードとリアルタイムプレビュー機能をサポートします。ここでは `createRspackVue2App` を使用して、Vue2 専用の Rspack アプリケーションインスタンスを作成します。
2. `server` 関数：HTTP サーバーを作成し、Gez ミドルウェアを統合して SSR リクエストを処理します。

### entry.server.ts

サーバーサイドレンダリングエントリーファイル `src/entry.server.ts` を作成します：

```ts title="src/entry.server.ts"
/**
 * @file サーバーサイドレンダリングエントリーファイル
 * @description サーバーサイドレンダリングプロセス、HTML 生成、リソース注入を担当
 */

import type { RenderContext } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

// レンダラーを作成
const renderer = createRenderer();

export default async (rc: RenderContext) => {
    // Vue アプリケーションインスタンスを作成
    const { app } = createApp();

    // Vue の renderToString を使用してページコンテンツを生成
    const html = await renderer.renderToString(app, {
        importMetaSet: rc.importMetaSet
    });

    // 依存関係の収集をコミットし、必要なリソースがすべてロードされることを確認
    await rc.commit();

    // 完全な HTML 構造を生成
    rc.html = `<!DOCTYPE html>
<html lang="ja">
<head>
    ${rc.preload()}
    <title>Gez クイックスタート</title>
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

## プロジェクトの実行

上記のファイル設定が完了したら、以下のコマンドを使用してプロジェクトを実行できます：

1. 開発モード：
```bash
npm run dev
```

2. プロジェクトをビルド：
```bash
npm run build
```

3. 本番環境で実行：
```bash
npm run start
```

これで、Gez を使用した Vue2 SSR アプリケーションが正常に作成されました！http://localhost:3000 にアクセスして効果を確認できます。