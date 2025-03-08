"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["7461"],{6030:function(e,n,r){r.r(n),r.d(n,{default:()=>a});var d=r(1549),s=r(6603);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",code:"code",pre:"pre",h2:"h2",h3:"h3",h4:"h4",ul:"ul",li:"li",strong:"strong"},(0,s.ah)(),e.components);return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(n.h1,{id:"app",children:["App",(0,d.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#app",children:"#"})]}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"App"})," は Gez フレームワークのアプリケーション抽象化で、アプリケーションのライフサイクル管理、静的リソース処理、サーバーサイドレンダリングを統一的に管理するインターフェースを提供します。"]}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"export default {\n  // 開発環境設定\n  async devApp(gez) {\n    return import('@gez/rspack').then((m) =>\n      m.createRspackHtmlApp(gez, {\n        config(rc) {\n          // Rspack 設定のカスタマイズ\n        }\n      })\n    );\n  }\n}\n"})}),"\n",(0,d.jsxs)(n.h2,{id:"型定義",children:["型定義",(0,d.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#型定義",children:"#"})]}),"\n",(0,d.jsxs)(n.h3,{id:"app-1",children:["App",(0,d.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#app-1",children:"#"})]}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-ts",children:"interface App {\n  middleware: Middleware;\n  render: (options?: RenderContextOptions) => Promise<RenderContext>;\n  build?: () => Promise<boolean>;\n  destroy?: () => Promise<boolean>;\n}\n"})}),"\n",(0,d.jsxs)(n.h4,{id:"middleware",children:["middleware",(0,d.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#middleware",children:"#"})]}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.strong,{children:"型"}),": ",(0,d.jsx)(n.code,{children:"Middleware"})]}),"\n"]}),"\n",(0,d.jsx)(n.p,{children:"静的リソース処理ミドルウェア。"}),"\n",(0,d.jsx)(n.p,{children:"開発環境："}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"ソースコードの静的リソースリクエストを処理"}),"\n",(0,d.jsx)(n.li,{children:"リアルタイムコンパイルとホットリロードをサポート"}),"\n",(0,d.jsx)(n.li,{children:"no-cache キャッシュポリシーを使用"}),"\n"]}),"\n",(0,d.jsx)(n.p,{children:"本番環境："}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"ビルド後の静的リソースを処理"}),"\n",(0,d.jsx)(n.li,{children:"不変ファイルの長期キャッシュをサポート（.final.xxx）"}),"\n",(0,d.jsx)(n.li,{children:"最適化されたリソースロード戦略"}),"\n"]}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-ts",children:"server.use(gez.middleware);\n"})}),"\n",(0,d.jsxs)(n.h4,{id:"render",children:["render",(0,d.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#render",children:"#"})]}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.strong,{children:"型"}),": ",(0,d.jsx)(n.code,{children:"(options?: RenderContextOptions) => Promise<RenderContext>"})]}),"\n"]}),"\n",(0,d.jsx)(n.p,{children:"サーバーサイドレンダリング関数。実行環境に応じて異なる実装を提供："}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"本番環境（start）：ビルド後のサーバーエントリーファイル（entry.server）をロードしてレンダリングを実行"}),"\n",(0,d.jsx)(n.li,{children:"開発環境（dev）：ソースコード内のサーバーエントリーファイルをロードしてレンダリングを実行"}),"\n"]}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-ts",children:"const rc = await gez.render({\n  params: { url: '/page' }\n});\nres.end(rc.html);\n"})}),"\n",(0,d.jsxs)(n.h4,{id:"build",children:["build",(0,d.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#build",children:"#"})]}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.strong,{children:"型"}),": ",(0,d.jsx)(n.code,{children:"() => Promise<boolean>"})]}),"\n"]}),"\n",(0,d.jsx)(n.p,{children:"本番環境ビルド関数。リソースのバンドルと最適化に使用されます。ビルドが成功すると true を返し、失敗すると false を返します。"}),"\n",(0,d.jsxs)(n.h4,{id:"destroy",children:["destroy",(0,d.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#destroy",children:"#"})]}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.strong,{children:"型"}),": ",(0,d.jsx)(n.code,{children:"() => Promise<boolean>"})]}),"\n"]}),"\n",(0,d.jsx)(n.p,{children:"リソースクリーンアップ関数。サーバーのシャットダウン、接続の切断などに使用されます。クリーンアップが成功すると true を返し、失敗すると false を返します。"})]})}function l(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,d.jsx)(n,{...e,children:(0,d.jsx)(i,{...e})}):i(e)}let a=l;l.__RSPRESS_PAGE_META={},l.__RSPRESS_PAGE_META["ja%2Fapi%2Fcore%2Fapp.md"]={toc:[{text:"型定義",id:"型定義",depth:2},{text:"App",id:"app-1",depth:3},{text:"middleware",id:"middleware",depth:4},{text:"render",id:"render",depth:4},{text:"build",id:"build",depth:4},{text:"destroy",id:"destroy",depth:4}],title:"App",headingTitle:"App",frontmatter:{titleSuffix:"Gez フレームワーク アプリケーション抽象インターフェース",description:"Gez フレームワークの App インターフェースについて詳しく説明します。アプリケーションのライフサイクル管理、静的リソース処理、サーバーサイドレンダリング機能をカバーし、開発者がアプリケーションのコア機能を理解し使用するのを支援します。",head:[["meta",{property:"keywords",content:"Gez, App, アプリケーション抽象, ライフサイクル, 静的リソース, サーバーサイドレンダリング, API"}]]}}}}]);