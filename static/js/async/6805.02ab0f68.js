"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["6805"],{9050:function(e,s,n){n.r(s),n.d(s,{default:()=>l});var r=n(1549),c=n(6603),d=n(1519);function i(e){let s=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",code:"code",h3:"h3",pre:"pre",ul:"ul",li:"li",strong:"strong"},(0,c.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(s.h1,{id:"gezrspack-vue",children:["@gez/rspack-vue",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#gezrspack-vue",children:"#"})]}),"\n",(0,r.jsx)(s.p,{children:"Rspack Vue パッケージは、Vue フレームワークに基づく Rspack アプリケーションを作成および設定するための API を提供します。Vue コンポーネントの開発、ビルド、サーバーサイドレンダリングをサポートします。"}),"\n",(0,r.jsxs)(s.h2,{id:"インストール",children:["インストール",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#インストール",children:"#"})]}),"\n",(0,r.jsxs)(s.p,{children:["パッケージマネージャを使用して ",(0,r.jsx)(s.code,{children:"@gez/rspack-vue"})," 開発依存関係をインストールします："]}),"\n",(0,r.jsx)(d.PackageManagerTabs,{command:"install @gez/rspack-vue -D"}),"\n",(0,r.jsxs)(s.h2,{id:"型エクスポート",children:["型エクスポート",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#型エクスポート",children:"#"})]}),"\n",(0,r.jsxs)(s.h3,{id:"buildtarget",children:["BuildTarget",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#buildtarget",children:"#"})]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"type BuildTarget = 'node' | 'client' | 'server'\n"})}),"\n",(0,r.jsx)(s.p,{children:"ビルドターゲット環境の型で、アプリケーションのビルドターゲット環境を定義します。ビルドプロセス中の特定の最適化と機能を設定するために使用されます："}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"node"}),": Node.js 環境で実行されるコードをビルド"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"client"}),": ブラウザ環境で実行されるコードをビルド"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"server"}),": サーバー環境で実行されるコードをビルド"]}),"\n"]}),"\n",(0,r.jsxs)(s.h3,{id:"rspackappconfigcontext",children:["RspackAppConfigContext",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackappconfigcontext",children:"#"})]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"interface RspackAppConfigContext {\n  gez: Gez\n  buildTarget: BuildTarget\n  config: RspackOptions\n  options: RspackAppOptions\n}\n"})}),"\n",(0,r.jsx)(s.p,{children:"Rspack アプリケーション設定コンテキストインターフェースで、設定フック関数内でアクセス可能なコンテキスト情報を提供します："}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"gez"}),": Gez フレームワークインスタンス"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"buildTarget"}),": 現在のビルドターゲット（client/server/node）"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"config"}),": Rspack 設定オブジェクト"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"options"}),": アプリケーション設定オプション"]}),"\n"]}),"\n",(0,r.jsxs)(s.h3,{id:"rspackappoptions",children:["RspackAppOptions",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackappoptions",children:"#"})]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"interface RspackAppOptions {\n  css?: 'css' | 'style'\n  loaders?: {\n    styleLoader?: string\n  }\n  styleLoader?: Record<string, any>\n  cssLoader?: Record<string, any>\n  target?: {\n    web?: string[]\n    node?: string[]\n  }\n  definePlugin?: Record<string, any>\n  config?: (context: RspackAppConfigContext) => void | Promise<void>\n}\n"})}),"\n",(0,r.jsx)(s.p,{children:"Rspack アプリケーション設定オプションインターフェース："}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"css"}),": CSS 出力方式で、'css'（独立ファイル）または 'style'（インラインスタイル）を選択可能"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"loaders"}),": カスタム loader 設定"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"styleLoader"}),": style-loader 設定オプション"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"cssLoader"}),": css-loader 設定オプション"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"target"}),": ビルドターゲット互換性設定"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"definePlugin"}),": グローバル定数定義"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"config"}),": 設定フック関数"]}),"\n"]}),"\n",(0,r.jsxs)(s.h3,{id:"rspackhtmlappoptions",children:["RspackHtmlAppOptions",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackhtmlappoptions",children:"#"})]}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"RspackAppOptions"})," を継承し、HTML アプリケーションの特定のオプションを設定するために使用されます。"]}),"\n",(0,r.jsxs)(s.h2,{id:"関数エクスポート",children:["関数エクスポート",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#関数エクスポート",children:"#"})]}),"\n",(0,r.jsxs)(s.h3,{id:"createrspackapp",children:["createRspackApp",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#createrspackapp",children:"#"})]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"function createRspackApp(gez: Gez, options?: RspackAppOptions): Promise<App>\n"})}),"\n",(0,r.jsx)(s.p,{children:"標準の Rspack アプリケーションインスタンスを作成します。"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.strong,{children:"パラメータ："})}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"gez"}),": Gez フレームワークインスタンス"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"options"}),": Rspack アプリケーション設定オプション"]}),"\n"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.strong,{children:"戻り値："})}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"作成されたアプリケーションインスタンスに解決される Promise を返します"}),"\n"]}),"\n",(0,r.jsxs)(s.h3,{id:"createrspackhtmlapp",children:["createRspackHtmlApp",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#createrspackhtmlapp",children:"#"})]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"function createRspackHtmlApp(gez: Gez, options?: RspackHtmlAppOptions): Promise<App>\n"})}),"\n",(0,r.jsx)(s.p,{children:"HTML タイプの Rspack アプリケーションインスタンスを作成します。"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.strong,{children:"パラメータ："})}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"gez"}),": Gez フレームワークインスタンス"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"options"}),": HTML アプリケーション設定オプション"]}),"\n"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.strong,{children:"戻り値："})}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"作成された HTML アプリケーションインスタンスに解決される Promise を返します"}),"\n"]}),"\n",(0,r.jsxs)(s.h2,{id:"定数エクスポート",children:["定数エクスポート",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#定数エクスポート",children:"#"})]}),"\n",(0,r.jsxs)(s.h3,{id:"rspack_loader",children:["RSPACK_LOADER",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#rspack_loader",children:"#"})]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"const RSPACK_LOADER: Record<string, string> = {\n  builtinSwcLoader: 'builtin:swc-loader',\n  lightningcssLoader: 'builtin:lightningcss-loader',\n  styleLoader: 'style-loader',\n  cssLoader: 'css-loader',\n  lessLoader: 'less-loader',\n  styleResourcesLoader: 'style-resources-loader',\n  workerRspackLoader: 'worker-rspack-loader'\n}\n"})}),"\n",(0,r.jsx)(s.p,{children:"Rspack に組み込まれた loader 識別子のマッピングオブジェクトで、一般的に使用される loader 名の定数を提供します："}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"builtinSwcLoader"}),": Rspack に組み込まれた SWC loader で、TypeScript/JavaScript ファイルを処理します"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"lightningcssLoader"}),": Rspack に組み込まれた lightningcss loader で、CSS ファイルの高性能コンパイラを処理します"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"styleLoader"}),": CSS を DOM に注入するための loader"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"cssLoader"}),": CSS ファイルを解析し、CSS モジュール化を処理するための loader"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"lessLoader"}),": Less ファイルを CSS にコンパイルするための loader"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"styleResourcesLoader"}),": グローバルスタイルリソース（変数、mixins など）を自動的にインポートするための loader"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"workerRspackLoader"}),": Web Worker ファイルを処理するための loader"]}),"\n"]}),"\n",(0,r.jsx)(s.p,{children:"これらの定数を使用して、設定内で組み込みの loader を参照し、手動で文字列を入力する必要がなくなります："}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"import { RSPACK_LOADER } from '@gez/rspack';\n\nexport default {\n  async devApp(gez) {\n    return import('@gez/rspack').then((m) =>\n      m.createRspackHtmlApp(gez, {\n        loaders: {\n          // 定数を使用して loader を参照\n          styleLoader: RSPACK_LOADER.styleLoader,\n          cssLoader: RSPACK_LOADER.cssLoader,\n          lightningcssLoader: RSPACK_LOADER.lightningcssLoader\n        }\n      })\n    );\n  }\n};\n"})}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.strong,{children:"注意事項："})}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"これらの loader は Rspack に組み込まれており、追加のインストールは不要です"}),"\n",(0,r.jsx)(s.li,{children:"カスタム loader 設定では、これらの定数を使用してデフォルトの loader 実装を置き換えることができます"}),"\n",(0,r.jsxs)(s.li,{children:["一部の loader（例：",(0,r.jsx)(s.code,{children:"builtinSwcLoader"}),"）には特定の設定オプションがあります。関連する設定ドキュメントを参照してください"]}),"\n"]}),"\n",(0,r.jsxs)(s.h2,{id:"モジュールエクスポート",children:["モジュールエクスポート",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#モジュールエクスポート",children:"#"})]}),"\n",(0,r.jsxs)(s.h3,{id:"rspack",children:["rspack",(0,r.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#rspack",children:"#"})]}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"@rspack/core"})," パッケージのすべての内容を再エクスポートし、Rspack のコア機能を完全に提供します。"]})]})}function a(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:s}=Object.assign({},(0,c.ah)(),e.components);return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}let l=a;a.__RSPRESS_PAGE_META={},a.__RSPRESS_PAGE_META["ja%2Fapi%2Fapp%2Frspack-vue.mdx"]={toc:[{text:"インストール",id:"インストール",depth:2},{text:"型エクスポート",id:"型エクスポート",depth:2},{text:"BuildTarget",id:"buildtarget",depth:3},{text:"RspackAppConfigContext",id:"rspackappconfigcontext",depth:3},{text:"RspackAppOptions",id:"rspackappoptions",depth:3},{text:"RspackHtmlAppOptions",id:"rspackhtmlappoptions",depth:3},{text:"関数エクスポート",id:"関数エクスポート",depth:2},{text:"createRspackApp",id:"createrspackapp",depth:3},{text:"createRspackHtmlApp",id:"createrspackhtmlapp",depth:3},{text:"定数エクスポート",id:"定数エクスポート",depth:2},{text:"RSPACK_LOADER",id:"rspack_loader",depth:3},{text:"モジュールエクスポート",id:"モジュールエクスポート",depth:2},{text:"rspack",id:"rspack",depth:3}],title:"@gez/rspack-vue",headingTitle:"@gez/rspack-vue",frontmatter:{titleSuffix:"Gez フレームワーク Vue ビルドツール",description:"Gez フレームワークの Vue 専用ビルドツールで、Vue 2/3 アプリケーションのビルドを完全にサポートします。コンポーネント開発、SSR レンダリング、パフォーマンス最適化などの機能を提供します。",head:[["meta",{property:"keywords",content:"Gez, Rspack, Vue, Vue2, Vue3, SSR, ビルドツール, コンポーネント開発, サーバーサイドレンダリング, パフォーマンス最適化"}]]}}}}]);