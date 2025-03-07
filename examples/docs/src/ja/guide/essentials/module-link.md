---
titleSuffix: Gez フレームワークのサービス間コード共有メカニズム
description: Gez フレームワークのモジュールリンクメカニズムについて詳しく説明します。サービス間のコード共有、依存関係管理、ESM 仕様の実装などを含み、開発者が効率的なマイクロフロントエンドアプリケーションを構築するのに役立ちます。
head:
  - - meta
    - property: keywords
      content: Gez, モジュールリンク, Module Link, ESM, コード共有, 依存関係管理, マイクロフロントエンド
---

# モジュールリンク

Gez フレームワークは、サービス間のコード共有と依存関係を管理するための完全なモジュールリンクメカニズムを提供します。このメカニズムは ESM（ECMAScript Module）仕様に基づいて実装されており、ソースコードレベルのモジュールエクスポートとインポート、および完全な依存関係管理機能をサポートしています。

### コアコンセプト

#### モジュールエクスポート
モジュールエクスポートは、サービス内の特定のコードユニット（コンポーネント、ユーティリティ関数など）を ESM 形式で外部に公開するプロセスです。以下の2種類のエクスポートタイプをサポートします：
- **ソースコードエクスポート**：プロジェクト内のソースコードファイルを直接エクスポート
- **依存関係エクスポート**：プロジェクトで使用するサードパーティの依存パッケージをエクスポート

#### モジュールインポート
モジュールインポートは、他のサービスがエクスポートしたコードユニットをサービス内で参照するプロセスです。以下の複数のインストール方法をサポートします：
- **ソースコードインストール**：開発環境に適しており、リアルタイムの変更とホットリロードをサポート
- **パッケージインストール**：本番環境に適しており、ビルド成果物を直接使用

### プリロードメカニズム

サービスのパフォーマンスを最適化するため、Gez はインテリジェントなモジュールプリロードメカニズムを実装しています：

1. **依存関係分析**
   - ビルド時にコンポーネント間の依存関係を分析
   - クリティカルパス上のコアモジュールを識別
   - モジュールのロード優先順位を決定

2. **ロード戦略**
   - **即時ロード**：クリティカルパス上のコアモジュール
   - **遅延ロード**：非クリティカルな機能モジュール
   - **オンデマンドロード**：条件付きレンダリングのモジュール

3. **リソース最適化**
   - インテリジェントなコード分割戦略
   - モジュールレベルのキャッシュ管理
   - オンデマンドでのコンパイルとバンドル

## モジュールエクスポート

### 設定説明

`entry.node.ts` でエクスポートするモジュールを設定します：

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // ソースコードファイルをエクスポート
            'root:src/components/button.vue',  // Vue コンポーネント
            'root:src/utils/format.ts',        // ユーティリティ関数
            // サードパーティの依存関係をエクスポート
            'npm:vue',                         // Vue フレームワーク
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

エクスポート設定は以下の2種類をサポートします：
- `root:*`：ソースコードファイルをエクスポート、パスはプロジェクトルートディレクトリからの相対パス
- `npm:*`：サードパーティの依存関係をエクスポート、パッケージ名を直接指定

## モジュールインポート

### 設定説明

`entry.node.ts` でインポートするモジュールを設定します：

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // インポート設定
        imports: {
            // ソースコードインストール：ビルド成果物ディレクトリを指定
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // パッケージインストール：パッケージディレクトリを指定
            'other-remote': 'root:./node_modules/other-remote'
        },
        // 外部依存関係設定
        externals: {
            // リモートモジュール内の依存関係を使用
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

設定項目の説明：
1. **imports**：リモートモジュールのローカルパスを設定
   - ソースコードインストール：ビルド成果物ディレクトリ（dist）を指定
   - パッケージインストール：パッケージディレクトリを直接指定

2. **externals**：外部依存関係を設定
   - リモートモジュール内の依存関係を共有
   - 同じ依存関係の重複バンドルを回避
   - 複数のモジュール間での依存関係共有をサポート

### インストール方法

#### ソースコードインストール
開発環境に適しており、リアルタイムの変更とホットリロードをサポートします。

1. **Workspace 方式**
Monorepo プロジェクトでの使用を推奨：
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Link 方式**
ローカル開発デバッグに使用：
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### パッケージインストール
本番環境に適しており、ビルド成果物を直接使用します。

1. **NPM Registry**
npm registry 経由でインストール：
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **静的サーバー**
HTTP/HTTPS プロトコル経由でインストール：
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## パッケージビルド

### 設定説明

`entry.node.ts` でビルドオプションを設定します：

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // モジュールエクスポート設定
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // ビルド設定
    pack: {
        // ビルドを有効化
        enable: true,

        // 出力設定
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // カスタム package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // ビルド前処理
        onBefore: async (gez, pkg) => {
            // 型宣言を生成
            // テストケースを実行
            // ドキュメントを更新など
        },

        // ビルド後処理
        onAfter: async (gez, pkg, file) => {
            // CDN にアップロード
            // npm レポジトリに公開
            // テスト環境にデプロイなど
        }
    }
} satisfies GezOptions;
```

### ビルド成果物

```
your-app-name.tgz
├── package.json        # パッケージ情報
├── index.js            # 本番環境エントリーポイント
├── server/             # サーバーサイドリソース
│   └── manifest.json   # サーバーサイドリソースマッピング
├── node/               # Node.js ランタイム
└── client/             # クライアントサイドリソース
    └── manifest.json   # クライアントサイドリソースマッピング
```

### リリースプロセス

```bash
# 1. 本番バージョンをビルド
gez build

# 2. npm に公開
npm publish dist/versions/your-app-name.tgz
```

## ベストプラクティス

### 開発環境設定
- **依存関係管理**
  - Workspace または Link 方式で依存関係をインストール
  - 依存関係のバージョンを統一管理
  - 同じ依存関係の重複インストールを回避

- **開発体験**
  - ホットリロード機能を有効化
  - 適切なプリロード戦略を設定
  - ビルド速度を最適化

### 本番環境設定
- **デプロイ戦略**
  - NPM Registry または静的サーバーを使用
  - ビルド成果物の完全性を確保
  - グレーリリースメカニズムを実施

- **パフォーマンス最適化**
  - リソースプリロードを適切に設定
  - モジュールロード順序を最適化
  - 効果的なキャッシュ戦略を実施

### バージョン管理
- **バージョン規約**
  - セマンティックバージョニングに従う
  - 詳細な更新履歴を維持
  - バージョン互換性テストを実施

- **依存関係更新**
  - 依存パッケージを適時更新
  - 定期的にセキュリティ監査を実施
  - 依存関係のバージョン一貫性を維持
```