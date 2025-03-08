"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["2652"],{1538:function(e,n,t){t.r(n),t.d(n,{default:()=>c});var r=t(1549),s=t(6603);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code",h3:"h3",ol:"ol",li:"li"},(0,s.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"html",children:["HTML",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#html",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"このチュートリアルでは、Gez を使用した HTML SSR アプリケーションをゼロから構築する方法を紹介します。Gez フレームワークを使用してサーバーサイドレンダリングアプリケーションを作成する方法を、完全な例を通して示します。"}),"\n",(0,r.jsxs)(n.h2,{id:"プロジェクト構造",children:["プロジェクト構造",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#プロジェクト構造",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"まず、プロジェクトの基本構造を確認しましょう："}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:".\n├── package.json         # プロジェクト設定ファイル、依存関係とスクリプトコマンドを定義\n├── tsconfig.json        # TypeScript 設定ファイル、コンパイルオプションを設定\n└── src                  # ソースコードディレクトリ\n    ├── app.ts           # メインアプリケーションコンポーネント、ページ構造とインタラクションロジックを定義\n    ├── create-app.ts    # アプリケーションインスタンス作成ファクトリ、アプリケーションの初期化を担当\n    ├── entry.client.ts  # クライアントサイドエントリーファイル、ブラウザサイドレンダリングを処理\n    ├── entry.node.ts    # Node.js サーバーエントリーファイル、開発環境設定とサーバー起動を担当\n    └── entry.server.ts  # サーバーサイドエントリーファイル、SSR レンダリングロジックを処理\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"プロジェクト設定",children:["プロジェクト設定",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#プロジェクト設定",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"package.json"})," ファイルを作成し、プロジェクトの依存関係とスクリプトを設定します："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n  "name": "ssr-demo-html",\n  "version": "1.0.0",\n  "type": "module",\n  "private": true,\n  "scripts": {\n    "dev": "gez dev",\n    "build": "npm run build:dts && npm run build:ssr",\n    "build:ssr": "gez build",\n    "preview": "gez preview",\n    "start": "NODE_ENV=production node dist/index.js",\n    "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src"\n  },\n  "dependencies": {\n    "@gez/core": "*"\n  },\n  "devDependencies": {\n    "@gez/rspack": "*",\n    "@types/node": "22.8.6",\n    "typescript": "^5.7.3"\n  }\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"package.json"})," ファイルを作成した後、プロジェクトの依存関係をインストールする必要があります。以下のいずれかのコマンドを使用してインストールできます："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"pnpm install\n# または\nyarn install\n# または\nnpm install\n"})}),"\n",(0,r.jsx)(n.p,{children:"これにより、TypeScript や SSR 関連の依存関係を含むすべての必要なパッケージがインストールされます。"}),"\n",(0,r.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"tsconfig.json"})," ファイルを作成し、TypeScript のコンパイルオプションを設定します："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "module": "ESNext",\n        "moduleResolution": "node",\n        "isolatedModules": true,\n        "resolveJsonModule": true,\n        \n        "target": "ESNext",\n        "lib": ["ESNext", "DOM"],\n        \n        "strict": true,\n        "skipLibCheck": true,\n        "types": ["@types/node"],\n        \n        "experimentalDecorators": true,\n        "allowSyntheticDefaultImports": true,\n        \n        "baseUrl": ".",\n        "paths": {\n            "ssr-demo-html/src/*": ["./src/*"],\n            "ssr-demo-html/*": ["./*"]\n        }\n    },\n    "include": ["src"],\n    "exclude": ["dist", "node_modules"]\n}\n'})}),"\n",(0,r.jsxs)(n.h2,{id:"ソースコード構造",children:["ソースコード構造",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#ソースコード構造",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"appts",children:["app.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#appts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["メインアプリケーションコンポーネント ",(0,r.jsx)(n.code,{children:"src/app.ts"})," を作成し、ページ構造とインタラクションロジックを実装します："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/app.ts"',children:"/**\n * @file サンプルコンポーネント\n * @description Gez フレームワークの基本的な機能をデモンストレーションするための、自動更新される時間付きのページタイトルを表示\n */\n\nexport default class App {\n    /**\n     * 現在時刻、ISO フォーマット\n     * @type {string}\n     */\n    public time = '';\n\n    /**\n     * アプリケーションインスタンスを作成\n     * @param {SsrContext} [ssrContext] - サーバーサイドコンテキスト、インポートメタデータのコレクションを含む\n     */\n    public constructor(public ssrContext?: SsrContext) {\n        // コンストラクタ内で追加の初期化は不要\n    }\n\n    /**\n     * ページ内容をレンダリング\n     * @returns {string} ページの HTML 構造を返す\n     */\n    public render(): string {\n        // サーバーサイド環境で正しくインポートメタデータを収集する\n        if (this.ssrContext) {\n            this.ssrContext.importMetaSet.add(import.meta);\n        }\n\n        return `\n        <div id=\"app\">\n            <h1><a href=\"https://www.jsesm.com/guide/frameworks/html.html\" target=\"_blank\">Gez クイックスタート</a></h1>\n            <time datetime=\"${this.time}\">${this.time}</time>\n        </div>\n        `;\n    }\n\n    /**\n     * クライアントサイドの初期化\n     * @throws {Error} 時間表示要素が見つからない場合にエラーをスロー\n     */\n    public onClient(): void {\n        // 時間表示要素を取得\n        const time = document.querySelector('#app time');\n        if (!time) {\n            throw new Error('時間表示要素が見つかりません');\n        }\n\n        // タイマーを設定し、1秒ごとに時間を更新\n        setInterval(() => {\n            this.time = new Date().toISOString();\n            time.setAttribute('datetime', this.time);\n            time.textContent = this.time;\n        }, 1000);\n    }\n\n    /**\n     * サーバーサイドの初期化\n     */\n    public onServer(): void {\n        this.time = new Date().toISOString();\n    }\n}\n\n/**\n * サーバーサイドコンテキストインターフェース\n * @interface\n */\nexport interface SsrContext {\n    /**\n     * インポートメタデータのコレクション\n     * @type {Set<ImportMeta>}\n     */\n    importMetaSet: Set<ImportMeta>;\n}\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"create-appts",children:["create-app.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#create-appts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"src/create-app.ts"})," ファイルを作成し、アプリケーションインスタンスの作成を担当します："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/create-app.ts"',children:"/**\n * @file アプリケーションインスタンス作成\n * @description アプリケーションインスタンスの作成と設定を担当\n */\n\nimport App from './app';\n\nexport function createApp() {\n    const app = new App();\n    return {\n        app\n    };\n}\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["クライアントサイドエントリーファイル ",(0,r.jsx)(n.code,{children:"src/entry.client.ts"})," を作成します："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.client.ts"',children:"/**\n * @file クライアントサイドエントリーファイル\n * @description クライアントサイドのインタラクションロジックと動的更新を担当\n */\n\nimport { createApp } from './create-app';\n\n// アプリケーションインスタンスを作成し、初期化\nconst { app } = createApp();\napp.onClient();\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"entry.node.ts"})," ファイルを作成し、開発環境の設定とサーバーの起動を担当します："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"/**\n * @file Node.js サーバーエントリーファイル\n * @description 開発環境の設定とサーバーの起動を担当し、SSR ランタイム環境を提供\n */\n\nimport http from 'node:http';\nimport type { GezOptions } from '@gez/core';\n\nexport default {\n    /**\n     * 開発環境のアプリケーション作成器を設定\n     * @description Rspack アプリケーションインスタンスを作成し、開発環境のビルドとホットリロードを設定\n     * @param gez Gez フレームワークインスタンス、コア機能と設定インターフェースを提供\n     * @returns 設定された Rspack アプリケーションインスタンスを返す、HMR とリアルタイムプレビューをサポート\n     */\n    async devApp(gez) {\n        return import('@gez/rspack').then((m) =>\n            m.createRspackHtmlApp(gez, {\n                config(context) {\n                    // ここで Rspack コンパイル設定をカスタマイズ\n                }\n            })\n        );\n    },\n\n    /**\n     * HTTP サーバーを設定して起動\n     * @description HTTP サーバーインスタンスを作成し、Gez ミドルウェアを統合して SSR リクエストを処理\n     * @param gez Gez フレームワークインスタンス、ミドルウェアとレンダリング機能を提供\n     */\n    async server(gez) {\n        const server = http.createServer((req, res) => {\n            // Gez ミドルウェアを使用してリクエストを処理\n            gez.middleware(req, res, async () => {\n                // サーバーサイドレンダリングを実行\n                const rc = await gez.render({\n                    params: { url: req.url }\n                });\n                res.end(rc.html);\n            });\n        });\n\n        server.listen(3000, () => {\n            console.log('サーバー起動: http://localhost:3000');\n        });\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,r.jsx)(n.p,{children:"このファイルは、開発環境の設定とサーバーの起動のためのエントリーファイルで、以下の2つの主要な機能を含みます："}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"devApp"})," 関数：開発環境の Rspack アプリケーションインスタンスを作成し、ホットリロードとリアルタイムプレビュー機能をサポートします。"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"server"})," 関数：HTTP サーバーを作成し、Gez ミドルウェアを統合して SSR リクエストを処理します。"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["サーバーサイドレンダリングエントリーファイル ",(0,r.jsx)(n.code,{children:"src/entry.server.ts"})," を作成します："]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"/**\n * @file サーバーサイドレンダリングエントリーファイル\n * @description サーバーサイドレンダリングプロセス、HTML 生成、リソース注入を担当\n */\n\nimport type { RenderContext } from '@gez/core';\nimport type App from './app';\nimport type { SsrContext } from './app';\nimport { createApp } from './create-app';\n\n// ページ内容生成ロジックをカプセル化\nconst renderToString = (app: App, ssrContext: SsrContext): string => {\n    // サーバーサイドレンダリングコンテキストをアプリケーションインスタンスに注入\n    app.ssrContext = ssrContext;\n    // サーバーサイドを初期化\n    app.onServer();\n\n    // ページ内容を生成\n    return app.render();\n};\n\nexport default async (rc: RenderContext) => {\n    // アプリケーションインスタンスを作成し、app インスタンスを含むオブジェクトを返す\n    const { app } = createApp();\n    // renderToString を使用してページ内容を生成\n    const html = renderToString(app, {\n        importMetaSet: rc.importMetaSet\n    });\n\n    // 依存関係の収集をコミットし、必要なリソースがすべてロードされることを確認\n    await rc.commit();\n\n    // 完全な HTML 構造を生成\n    rc.html = `<!DOCTYPE html>\n<html lang=\"ja\">\n<head>\n    ${rc.preload()}\n    <title>Gez クイックスタート</title>\n    ${rc.css()}\n</head>\n<body>\n    ${html}\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n</body>\n</html>\n`;\n};\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"プロジェクトの実行",children:["プロジェクトの実行",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#プロジェクトの実行",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"上記のファイル設定が完了したら、以下のコマンドを使用してプロジェクトを実行できます："}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"開発モード："}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run dev\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:"プロジェクトをビルド："}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"3",children:["\n",(0,r.jsx)(n.li,{children:"本番環境で実行："}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,r.jsxs)(n.p,{children:["これで、Gez を使用した HTML SSR アプリケーションが正常に作成されました！ ",(0,r.jsx)(n.a,{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer",children:"http://localhost:3000"})," にアクセスして結果を確認できます。"]})]})}function a(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}let c=a;a.__RSPRESS_PAGE_META={},a.__RSPRESS_PAGE_META["ja%2Fguide%2Fframeworks%2Fhtml.md"]={toc:[{text:"プロジェクト構造",id:"プロジェクト構造",depth:2},{text:"プロジェクト設定",id:"プロジェクト設定",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3},{text:"ソースコード構造",id:"ソースコード構造",depth:2},{text:"app.ts",id:"appts",depth:3},{text:"create-app.ts",id:"create-appts",depth:3},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"プロジェクトの実行",id:"プロジェクトの実行",depth:2}],title:"HTML",headingTitle:"HTML",frontmatter:{titleSuffix:"Gez フレームワーク HTML SSR アプリケーション例",description:"Gez を使用した HTML SSR アプリケーションをゼロから構築する方法を紹介します。プロジェクトの初期化、HTML 設定、エントリーファイルの設定など、フレームワークの基本的な使い方を実例で示します。",head:[["meta",{property:"keywords",content:"Gez, HTML, SSRアプリケーション, TypeScript設定, プロジェクト初期化, サーバーサイドレンダリング, クライアントサイドインタラクション"}]]}}}}]);