---
titleSuffix: Gez 框架服務間程式碼共享機制
description: 詳細介紹 Gez 框架的模組連結機制，包括服務間程式碼共享、依賴管理和 ESM 規範實現，幫助開發者建構高效的微前端應用。
head:
  - - meta
    - property: keywords
      content: Gez, 模組連結, Module Link, ESM, 程式碼共享, 依賴管理, 微前端
---

# 模組連結

Gez 框架提供了一套完整的模組連結機制，用於管理服務間的程式碼共享和依賴關係。該機制基於 ESM（ECMAScript Module）規範實現，支援原始碼層級的模組匯出和匯入，以及完整的依賴管理功能。

### 核心概念

#### 模組匯出
模組匯出是將服務中的特定程式碼單元（如元件、工具函數等）以 ESM 格式對外暴露的過程。支援兩種匯出類型：
- **原始碼匯出**：直接匯出專案中的原始碼檔案
- **依賴匯出**：匯出專案使用的第三方依賴套件

#### 模組匯入
模組匯入是在服務中引用其他服務匯出的程式碼單元的過程。支援多種安裝方式：
- **原始碼安裝**：適用於開發環境，支援即時修改和熱更新
- **軟體包安裝**：適用於生產環境，直接使用建構產物

### 預載機制

為了最佳化服務效能，Gez 實現了智慧的模組預載機制：

1. **依賴分析**
   - 建構時分析元件間的依賴關係
   - 識別關鍵路徑上的核心模組
   - 確定模組的載入優先順序

2. **載入策略**
   - **立即載入**：關鍵路徑上的核心模組
   - **延遲載入**：非關鍵功能模組
   - **按需載入**：條件渲染的模組

3. **資源最佳化**
   - 智慧的程式碼分割策略
   - 模組層級的快取管理
   - 按需編譯和打包

## 模組匯出

### 設定說明

在 `entry.node.ts` 中設定需要匯出的模組：

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // 匯出原始碼檔案
            'root:src/components/button.vue',  // Vue 元件
            'root:src/utils/format.ts',        // 工具函數
            // 匯出第三方依賴
            'npm:vue',                         // Vue 框架
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

匯出設定支援兩種類型：
- `root:*`：匯出原始碼檔案，路徑相對於專案根目錄
- `npm:*`：匯出第三方依賴，直接指定套件名稱

## 模組匯入

### 設定說明

在 `entry.node.ts` 中設定需要匯入的模組：

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // 匯入設定
        imports: {
            // 原始碼安裝：指向建構產物目錄
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // 軟體包安裝：指向套件目錄
            'other-remote': 'root:./node_modules/other-remote'
        },
        // 外部依賴設定
        externals: {
            // 使用遠端模組中的依賴
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

設定項說明：
1. **imports**：設定遠端模組的本機路徑
   - 原始碼安裝：指向建構產物目錄（dist）
   - 軟體包安裝：直接指向套件目錄

2. **externals**：設定外部依賴
   - 用於共享遠端模組中的依賴
   - 避免重複打包相同依賴
   - 支援多個模組共享依賴

### 安裝方式

#### 原始碼安裝
適用於開發環境，支援即時修改和熱更新。

1. **Workspace 方式**
推薦在 Monorepo 專案中使用：
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Link 方式**
用於本機開發偵錯：
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### 軟體包安裝
適用於生產環境，直接使用建構產物。

1. **NPM Registry**
透過 npm registry 安裝：
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **靜態伺服器**
透過 HTTP/HTTPS 協定安裝：
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## 軟體包建構

### 設定說明

在 `entry.node.ts` 中設定建構選項：

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // 模組匯出設定
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // 建構設定
    pack: {
        // 啟用建構
        enable: true,

        // 輸出設定
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // 自訂 package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // 建構前處理
        onBefore: async (gez, pkg) => {
            // 產生型別宣告
            // 執行測試用例
            // 更新文件等
        },

        // 建構後處理
        onAfter: async (gez, pkg, file) => {
            // 上傳到 CDN
            // 發布到 npm 倉庫
            // 部署到測試環境等
        }
    }
} satisfies GezOptions;
```

### 建構產物

```
your-app-name.tgz
├── package.json        # 套件資訊
├── index.js            # 生產環境入口
├── server/             # 伺服器端資源
│   └── manifest.json   # 伺服器端資源映射
├── node/               # Node.js 執行環境
└── client/             # 客戶端資源
    └── manifest.json   # 客戶端資源映射
```

### 發布流程

```bash
# 1. 建構生產版本
gez build

# 2. 發布到 npm
npm publish dist/versions/your-app-name.tgz
```

## 最佳實踐

### 開發環境設定
- **依賴管理**
  - 使用 Workspace 或 Link 方式安裝依賴
  - 統一管理依賴版本
  - 避免重複安裝相同依賴

- **開發體驗**
  - 啟用熱更新功能
  - 設定合適的預載策略
  - 最佳化建構速度

### 生產環境設定
- **部署策略**
  - 使用 NPM Registry 或靜態伺服器
  - 確保建構產物完整性
  - 實施灰度發布機制

- **效能最佳化**
  - 合理設定資源預載
  - 最佳化模組載入順序
  - 實施有效的快取策略

### 版本管理
- **版本規範**
  - 遵循語意化版本規範
  - 維護詳細的更新日誌
  - 做好版本相容性測試

- **依賴更新**
  - 及時更新依賴套件
  - 定期進行安全稽核
  - 保持依賴版本一致性
```