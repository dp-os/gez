"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["6452"],{4232:function(e,r,n){n.r(r),n.d(r,{default:()=>l});var s=n(1549),i=n(6603);function d(e){let r=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",ul:"ul",li:"li",strong:"strong",h3:"h3",div:"div"},(0,i.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(r.h1,{id:"イントロダクション",children:["イントロダクション",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#イントロダクション",children:"#"})]}),"\n",(0,s.jsxs)(r.h2,{id:"プロジェクト背景",children:["プロジェクト背景",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#プロジェクト背景",children:"#"})]}),"\n",(0,s.jsx)(r.p,{children:"Gez は ECMAScript Modules (ESM) を基盤としたモダンなマイクロフロントエンドフレームワークで、高性能で拡張性の高いサーバーサイドレンダリング（SSR）アプリケーションの構築に焦点を当てています。Genesis プロジェクトの第三世代製品として、Gez は技術進化の過程で絶えず革新を続けています："}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"v1.0"}),"：HTTP リクエストを利用したリモートコンポーネントのオンデマンドロードを実現"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"v2.0"}),"：Webpack Module Federation を基盤としたアプリケーション統合を実現"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"v3.0"}),"：ブラウザのネイティブ ESM を基盤に再設計された",(0,s.jsx)(r.a,{href:"/guide/essentials/module-link",children:"モジュールリンク"}),"システム"]}),"\n"]}),"\n",(0,s.jsxs)(r.h2,{id:"技術背景",children:["技術背景",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#技術背景",children:"#"})]}),"\n",(0,s.jsx)(r.p,{children:"マイクロフロントエンドアーキテクチャの発展において、従来のソリューションには以下のような課題がありました："}),"\n",(0,s.jsxs)(r.h3,{id:"既存ソリューションの課題",children:["既存ソリューションの課題",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#既存ソリューションの課題",children:"#"})]}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"パフォーマンスのボトルネック"}),"：ランタイム依存性注入と JavaScript サンドボックスプロキシによる顕著なパフォーマンスオーバーヘッド"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"隔離メカニズム"}),"：独自開発のサンドボックス環境ではブラウザのネイティブなモジュール隔離能力に及ばない"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"ビルドの複雑さ"}),"：依存関係の共有を実現するためのビルドツールの改造により、プロジェクトのメンテナンスコストが増加"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"標準からの逸脱"}),"：特殊なデプロイ戦略とランタイム処理メカニズムが、モダンな Web 開発標準から外れている"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"エコシステムの制限"}),"：フレームワークの結合とカスタム API により、技術スタックの選択が制限される"]}),"\n"]}),"\n",(0,s.jsxs)(r.h3,{id:"技術革新",children:["技術革新",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#技術革新",children:"#"})]}),"\n",(0,s.jsx)(r.p,{children:"Gez はモダンな Web 標準に基づき、新たなソリューションを提供します："}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"ネイティブモジュールシステム"}),"：ブラウザのネイティブ ESM と Import Maps を利用した依存関係管理により、より高速な解析と実行を実現"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"標準的な隔離メカニズム"}),"：ECMAScript モジュールスコープに基づいた信頼性の高いアプリケーション隔離"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"オープンな技術スタック"}),"：任意のモダンなフロントエンドフレームワークのシームレスな統合をサポート"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"開発体験の最適化"}),"：直感的な開発モードと完全なデバッグ能力を提供"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"究極のパフォーマンス最適化"}),"：ネイティブ能力を活用したゼロランタイムオーバーヘッドとインテリジェントなキャッシュ戦略"]}),"\n"]}),"\n",(0,s.jsxs)(r.div,{className:"rspress-directive tip",children:[(0,s.jsx)(r.div,{className:"rspress-directive-title",children:"TIP"}),(0,s.jsx)(r.div,{className:"rspress-directive-content",children:(0,s.jsx)(r.p,{children:"Gez は高性能で拡張性の高いマイクロフロントエンドインフラストラクチャの構築に注力しており、特に大規模なサーバーサイドレンダリングアプリケーションに適しています。"})})]}),"\n",(0,s.jsxs)(r.h2,{id:"技術仕様",children:["技術仕様",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#技術仕様",children:"#"})]}),"\n",(0,s.jsxs)(r.h3,{id:"環境依存",children:["環境依存",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#環境依存",children:"#"})]}),"\n",(0,s.jsxs)(r.p,{children:["詳細なブラウザと Node.js の環境要件については、",(0,s.jsx)(r.a,{href:"/guide/start/environment",children:"環境要件"}),"ドキュメントを参照してください。"]}),"\n",(0,s.jsxs)(r.h3,{id:"コア技術スタック",children:["コア技術スタック",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#コア技術スタック",children:"#"})]}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"依存関係管理"}),"：",(0,s.jsx)(r.a,{href:"https://caniuse.com/?search=import%20map",target:"_blank",rel:"noopener noreferrer",children:"Import Maps"})," を利用したモジュールマッピングと、",(0,s.jsx)(r.a,{href:"https://github.com/guybedford/es-module-shims",target:"_blank",rel:"noopener noreferrer",children:"es-module-shims"})," による互換性サポート"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"ビルドシステム"}),"：Rspack の ",(0,s.jsx)(r.a,{href:"https://rspack.dev/config/externals#externalstypemodule-import",target:"_blank",rel:"noopener noreferrer",children:"module-import"})," を基盤とした外部依存関係の処理"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"開発ツールチェーン"}),"：ESM ホットリロードと TypeScript ネイティブ実行をサポート"]}),"\n"]}),"\n",(0,s.jsxs)(r.h2,{id:"フレームワークの位置付け",children:["フレームワークの位置付け",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#フレームワークの位置付け",children:"#"})]}),"\n",(0,s.jsxs)(r.p,{children:["Gez は ",(0,s.jsx)(r.a,{href:"https://nextjs.org",target:"_blank",rel:"noopener noreferrer",children:"Next.js"})," や ",(0,s.jsx)(r.a,{href:"https://nuxt.com/",target:"_blank",rel:"noopener noreferrer",children:"Nuxt.js"})," とは異なり、マイクロフロントエンドインフラストラクチャの提供に焦点を当てています："]}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"モジュールリンクシステム"}),"：効率的で信頼性の高いモジュールのインポートとエクスポートを実現"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"サーバーサイドレンダリング"}),"：柔軟な SSR 実装メカニズムを提供"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"型システムサポート"}),"：完全な TypeScript 型定義を統合"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"フレームワーク中立性"}),"：主要なフロントエンドフレームワークの統合をサポート"]}),"\n"]}),"\n",(0,s.jsxs)(r.h2,{id:"アーキテクチャ設計",children:["アーキテクチャ設計",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#アーキテクチャ設計",children:"#"})]}),"\n",(0,s.jsxs)(r.h3,{id:"集中型依存関係管理",children:["集中型依存関係管理",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#集中型依存関係管理",children:"#"})]}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"統一された依存関係ソース"}),"：集中化されたサードパーティ依存関係管理"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"自動化された配布"}),"：依存関係更新のグローバルな自動同期"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"バージョン一貫性"}),"：正確な依存関係バージョン管理"]}),"\n"]}),"\n",(0,s.jsxs)(r.h3,{id:"モジュール設計",children:["モジュール設計",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#モジュール設計",children:"#"})]}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"責務分離"}),"：ビジネスロジックとインフラストラクチャの分離"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"プラグインメカニズム"}),"：モジュールの柔軟な組み合わせと置換をサポート"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"標準化されたインターフェース"}),"：モジュール間の通信プロトコルの標準化"]}),"\n"]}),"\n",(0,s.jsxs)(r.h3,{id:"パフォーマンス最適化",children:["パフォーマンス最適化",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#パフォーマンス最適化",children:"#"})]}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"ゼロオーバーヘッド原則"}),"：ブラウザのネイティブ能力を最大限に活用"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"インテリジェントキャッシュ"}),"：コンテンツハッシュに基づいた正確なキャッシュ戦略"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.strong,{children:"オンデマンドロード"}),"：細分化されたコード分割と依存関係管理"]}),"\n"]}),"\n",(0,s.jsxs)(r.h2,{id:"プロジェクトの成熟度",children:["プロジェクトの成熟度",(0,s.jsx)(r.a,{className:"header-anchor","aria-hidden":"true",href:"#プロジェクトの成熟度",children:"#"})]}),"\n",(0,s.jsx)(r.p,{children:"Gez は約 5 年間のイテレーション（v1.0 から v3.0）を経て、エンタープライズ環境で全面的に検証されています。現在、数十のビジネスプロジェクトを安定して支えており、技術スタックのモダン化を推進し続けています。フレームワークの安定性、信頼性、パフォーマンスの優位性は実践で十分に検証されており、大規模アプリケーション開発に信頼できる技術基盤を提供しています。"})]})}function h(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:r}=Object.assign({},(0,i.ah)(),e.components);return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}let l=h;h.__RSPRESS_PAGE_META={},h.__RSPRESS_PAGE_META["ja%2Fguide%2Fstart%2Fintroduction.md"]={toc:[{text:"プロジェクト背景",id:"プロジェクト背景",depth:2},{text:"技術背景",id:"技術背景",depth:2},{text:"既存ソリューションの課題",id:"既存ソリューションの課題",depth:3},{text:"技術革新",id:"技術革新",depth:3},{text:"技術仕様",id:"技術仕様",depth:2},{text:"環境依存",id:"環境依存",depth:3},{text:"コア技術スタック",id:"コア技術スタック",depth:3},{text:"フレームワークの位置付け",id:"フレームワークの位置付け",depth:2},{text:"アーキテクチャ設計",id:"アーキテクチャ設計",depth:2},{text:"集中型依存関係管理",id:"集中型依存関係管理",depth:3},{text:"モジュール設計",id:"モジュール設計",depth:3},{text:"パフォーマンス最適化",id:"パフォーマンス最適化",depth:3},{text:"プロジェクトの成熟度",id:"プロジェクトの成熟度",depth:2}],title:"イントロダクション",headingTitle:"イントロダクション",frontmatter:{titleSuffix:"Gez フレームワーク概要と技術革新",description:"Gez マイクロフロントエンドフレームワークのプロジェクト背景、技術進化、コアメリットを深く理解し、ESM ベースのモダンなサーバーサイドレンダリング（SSR）ソリューションを探求します。",head:[["meta",{property:"keywords",content:"Gez, マイクロフロントエンド, ESM, サーバーサイドレンダリング, SSR, 技術革新, モジュールフェデレーション"}]]}}}}]);