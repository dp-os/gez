"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["6906"],{2035:function(e,n,s){s.r(n),s.d(n,{default:()=>c});var r=s(1549),i=s(6603);function t(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",pre:"pre",code:"code",div:"div",ul:"ul",li:"li",strong:"strong"},(0,i.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"標準規約",children:["標準規約",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#標準規約",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"Gez はモダンな SSR フレームワークで、標準化されたプロジェクト構造とパス解決メカニズムを採用しており、開発環境と本番環境での一貫性と保守性を確保します。"}),"\n",(0,r.jsxs)(n.h2,{id:"プロジェクト構造規約",children:["プロジェクト構造規約",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#プロジェクト構造規約",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"標準ディレクトリ構造",children:["標準ディレクトリ構造",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#標準ディレクトリ構造",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-txt",children:"root\n│─ dist                  # コンパイル出力ディレクトリ\n│  ├─ package.json       # コンパイル後のパッケージ設定\n│  ├─ server             # サーバーサイドのコンパイル出力\n│  │  └─ manifest.json   # コンパイルマニフェスト出力、importmap 生成用\n│  ├─ node               # Node サーバープログラムのコンパイル出力\n│  ├─ client             # クライアントサイドのコンパイル出力\n│  │  ├─ versions        # バージョン保存ディレクトリ\n│  │  │  └─ latest.tgz   # dist ディレクトリをアーカイブし、パッケージ配布用\n│  │  └─ manifest.json   # コンパイルマニフェスト出力、importmap 生成用\n│  └─ src                # tsc で生成されたファイルタイプ\n├─ src\n│  ├─ entry.server.ts    # サーバーサイドアプリケーションのエントリーポイント\n│  ├─ entry.client.ts    # クライアントサイドアプリケーションのエントリーポイント\n│  └─ entry.node.ts      # Node サーバーアプリケーションのエントリーポイント\n├─ tsconfig.json         # TypeScript 設定\n└─ package.json          # パッケージ設定\n"})}),"\n",(0,r.jsxs)(n.div,{className:"rspress-directive tip",children:[(0,r.jsx)(n.div,{className:"rspress-directive-title",children:"拡張知識"}),(0,r.jsxs)(n.div,{className:"rspress-directive-content",children:["\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"gez.name"})," は ",(0,r.jsx)(n.code,{children:"package.json"})," の ",(0,r.jsx)(n.code,{children:"name"})," フィールドから取得されます"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"dist/package.json"})," はルートディレクトリの ",(0,r.jsx)(n.code,{children:"package.json"})," から生成されます"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"packs.enable"})," を ",(0,r.jsx)(n.code,{children:"true"})," に設定すると、",(0,r.jsx)(n.code,{children:"dist"})," ディレクトリがアーカイブされます"]}),"\n"]}),"\n"]})]}),"\n",(0,r.jsxs)(n.h2,{id:"エントリーファイル規約",children:["エントリーファイル規約",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#エントリーファイル規約",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"クライアントサイドのエントリーファイルは以下の役割を担います："}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"アプリケーションの初期化"}),"：クライアントアプリケーションの基本設定を構成"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"ルーティング管理"}),"：クライアントサイドのルーティングとナビゲーションを処理"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"状態管理"}),"：クライアントサイドの状態の保存と更新を実装"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"インタラクション処理"}),"：ユーザーイベントとUIインタラクションを管理"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"サーバーサイドのエントリーファイルは以下の役割を担います："}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"サーバーサイドレンダリング"}),"：SSR レンダリングプロセスを実行"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"HTML 生成"}),"：初期ページ構造を構築"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"データプリフェッチ"}),"：サーバーサイドのデータ取得を処理"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"状態注入"}),"：サーバーサイドの状態をクライアントに渡す"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"SEO 最適化"}),"：ページの検索エンジン最適化を確保"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"Node.js サーバーのエントリーファイルは以下の役割を担います："}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"サーバー設定"}),"：HTTP サーバーのパラメータを設定"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"ルーティング処理"}),"：サーバーサイドのルーティングルールを管理"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"ミドルウェア統合"}),"：サーバーミドルウェアを構成"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"環境管理"}),"：環境変数と設定を処理"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"リクエスト応答"}),"：HTTP リクエストとレスポンスを処理"]}),"\n"]}),"\n",(0,r.jsxs)(n.h2,{id:"設定ファイル規約",children:["設定ファイル規約",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#設定ファイル規約",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n    "name": "your-app-name",\n    "type": "module",\n    "scripts": {\n        "dev": "gez dev",\n        "build": "npm run build:dts && npm run build:ssr",\n        "build:ssr": "gez build",\n        "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src",\n        "preview": "gez preview",\n        "start": "NODE_ENV=production node dist/index.js"\n    }\n}\n'})}),"\n",(0,r.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "isolatedModules": true,\n        "allowJs": false,\n        "experimentalDecorators": true,\n        "resolveJsonModule": true,\n        "types": [\n            "@types/node"\n        ],\n        "target": "ESNext",\n        "module": "ESNext",\n        "importHelpers": false,\n        "declaration": true,\n        "sourceMap": true,\n        "strict": true,\n        "noImplicitAny": false,\n        "noImplicitReturns": false,\n        "noFallthroughCasesInSwitch": true,\n        "noUnusedLocals": false,\n        "noUnusedParameters": false,\n        "moduleResolution": "node",\n        "esModuleInterop": true,\n        "skipLibCheck": true,\n        "allowSyntheticDefaultImports": true,\n        "forceConsistentCasingInFileNames": true,\n        "noEmit": true\n    },\n    "include": [\n        "src",\n        "**.ts"\n    ],\n    "exclude": [\n        "dist"\n    ]\n}\n'})})]})}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,i.ah)(),e.components);return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(t,{...e})}):t(e)}let c=d;d.__RSPRESS_PAGE_META={},d.__RSPRESS_PAGE_META["ja%2Fguide%2Fessentials%2Fstd.md"]={toc:[{text:"プロジェクト構造規約",id:"プロジェクト構造規約",depth:2},{text:"標準ディレクトリ構造",id:"標準ディレクトリ構造",depth:3},{text:"エントリーファイル規約",id:"エントリーファイル規約",depth:2},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"設定ファイル規約",id:"設定ファイル規約",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3}],title:"標準規約",headingTitle:"標準規約",frontmatter:{titleSuffix:"Gez フレームワーク プロジェクト構造と規約ガイド",description:"Gez フレームワークの標準プロジェクト構造、エントリーファイル規約、設定ファイル規約について詳しく説明し、開発者が規範的で保守可能な SSR アプリケーションを構築するのを支援します。",head:[["meta",{property:"keywords",content:"Gez, プロジェクト構造, エントリーファイル, 設定規約, SSRフレームワーク, TypeScript, プロジェクト規約, 開発標準"}]]}}}}]);