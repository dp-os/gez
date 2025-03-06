---
titleSuffix: Gez フレームワークモジュール設定 API リファレンス
description: Gez フレームワークの ModuleConfig 設定インターフェースについて詳しく説明します。モジュールのインポート/エクスポートルール、エイリアス設定、外部依存関係管理などを含み、開発者がフレームワークのモジュールシステムを深く理解するのに役立ちます。
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, モジュール設定, モジュールインポート/エクスポート, 外部依存関係, エイリアス設定, 依存関係管理, Webアプリケーションフレームワーク
---

# ModuleConfig

ModuleConfig は、Gez フレームワークのモジュール設定機能を提供し、モジュールのインポート/エクスポートルール、エイリアス設定、外部依存関係などを定義するために使用されます。

## 型定義

### PathType

- **型定義**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

モジュールパスのタイプを表す列挙型：
- `npm`: node_modules 内の依存関係を表します
- `root`: プロジェクトルートディレクトリ内のファイルを表します

### ModuleConfig

- **型定義**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

モジュール設定インターフェースで、サービスのエクスポート、インポート、外部依存関係の設定を定義します。

#### exports

エクスポート設定リストで、サービス内の特定のコードユニット（コンポーネント、ユーティリティ関数など）を ESM 形式で外部に公開します。

以下の2種類をサポートします：
- `root:*`: ソースコードファイルをエクスポートします。例：'root:src/components/button.vue'
- `npm:*`: サードパーティの依存関係をエクスポートします。例：'npm:vue'

#### imports

インポート設定マップで、リモートモジュールとそのローカルパスを設定します。

インストール方法によって設定が異なります：
- ソースコードインストール（Workspace、Git）：dist ディレクトリを指す必要があります
- パッケージインストール（Link、静的サーバー、プライベートミラーソース、File）：パッケージディレクトリを直接指します

#### externals

外部依存関係マップで、使用する外部依存関係を設定します。通常はリモートモジュール内の依存関係を使用します。

**例**：
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // エクスポート設定
    exports: [
      'root:src/components/button.vue',  // ソースコードファイルをエクスポート
      'root:src/utils/format.ts',
      'npm:vue',  // サードパーティの依存関係をエクスポート
      'npm:vue-router'
    ],

    // インポート設定
    imports: {
      // ソースコードインストール方式：dist ディレクトリを指す必要があります
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // パッケージインストール方式：パッケージディレクトリを直接指します
      'other-remote': 'root:./node_modules/other-remote'
    },

    // 外部依存関係設定
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **型定義**:
```ts
interface ParsedModuleConfig {
  name: string
  root: string
  exports: {
    name: string
    type: PathType
    importName: string
    exportName: string
    exportPath: string
    externalName: string
  }[]
  imports: {
    name: string
    localPath: string
  }[]
  externals: Record<string, { match: RegExp; import?: string }>
}
```

解析されたモジュール設定で、元のモジュール設定を標準化された内部形式に変換します：

#### name
現在のサービスの名前
- モジュールを識別し、インポートパスを生成するために使用されます

#### root
現在のサービスのルートディレクトリパス
- 相対パスを解決し、ビルド成果物を保存するために使用されます

#### exports
エクスポート設定リスト
- `name`: 元のエクスポートパス。例：'npm:vue' または 'root:src/components'
- `type`: パスのタイプ（npm または root）
- `importName`: インポート名。形式：'${serviceName}/${type}/${path}'
- `exportName`: サービスルートディレクトリからのエクスポートパス
- `exportPath`: 実際のファイルパス
- `externalName`: 外部依存関係名。他のサービスがこのモジュールをインポートする際の識別子として使用されます

#### imports
インポート設定リスト
- `name`: 外部サービスの名前
- `localPath`: 外部モジュールのビルド成果物を保存するためのローカルストレージパス

#### externals
外部依存関係マップ
- モジュールのインポートパスを実際のモジュールの位置にマッピングします
- `match`: インポートステートメントをマッチングするための正規表現
- `import`: 実際のモジュールパス