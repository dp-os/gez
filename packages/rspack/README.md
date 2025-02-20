# @gez/rspack

@gez/rspack 是 Gez 框架的 Rspack 构建包，提供了一套用于创建和配置 Rspack 应用的 API，支持标准应用和 HTML 应用的构建与开发。

## 特性

- 🚀 基于 Rust 构建的 Rspack，提供极致的构建性能
- 💡 完整的 TypeScript/JavaScript 支持
- 🎨 内置 CSS/Less 处理能力
- 🖼️ 支持图片、字体、媒体等资源处理
- 🛠️ 灵活的配置系统
- 🔧 开箱即用的开发体验

## 安装

```bash
# npm
npm install @gez/rspack -D

# yarn
yarn add @gez/rspack -D

# pnpm
pnpm add @gez/rspack -D
```

## 基础使用

### 创建标准应用

```ts
import type { GezOptions } from '@gez/core';

export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackApp(gez, {
                config({ config }) {
                    // 自定义 Rspack 配置
                    config.module = {
                        ...config.module,
                        rules: [
                            {
                                test: /\.ts$/,
                                exclude: [/node_modules/],
                                loader: 'builtin:swc-loader',
                                options: {
                                    jsc: {
                                        parser: {
                                            syntax: 'typescript'
                                        }
                                    }
                                }
                            }
                        ]
                    };
                }
            })
        );
    }
} satisfies GezOptions;
```

### 创建 HTML 应用

```ts
import type { GezOptions } from '@gez/core';

export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                // CSS 输出方式
                css: 'css',
                // 构建目标配置
                target: {
                    web: ['chrome>=87', 'firefox>=78', 'safari>=14'],
                    node: ['node>=16']
                },
                // 全局常量定义
                definePlugin: {
                    'process.env.APP_ENV': JSON.stringify('production')
                }
            })
        );
    }
} satisfies GezOptions;
```

## API 参考

### 类型导出

- `BuildTarget`: 构建目标环境类型
- `RspackAppConfigContext`: Rspack 应用配置上下文
- `RspackAppOptions`: Rspack 应用配置选项
- `RspackHtmlAppOptions`: HTML 应用特定配置选项

### 函数导出

- `createRspackApp`: 创建标准 Rspack 应用
- `createRspackHtmlApp`: 创建 HTML 类型的 Rspack 应用

### 常量导出

- `RSPACK_LOADER`: Rspack 内置的 loader 标识符映射

## 配置参考

### RspackAppOptions

```ts
interface RspackAppOptions {
    // 是否启用代码压缩
    minimize?: boolean;
    // Rspack 配置钩子函数
    config?: (context: RspackAppConfigContext) => void;
}
```

### RspackHtmlAppOptions

```ts
interface RspackHtmlAppOptions extends RspackAppOptions {
    // CSS 输出模式配置
    css?: 'css' | 'js' | false;
    // 自定义 loader 配置
    loaders?: Partial<Record<keyof typeof RSPACK_LOADER, string>>;
    // style-loader 配置项
    styleLoader?: Record<string, any>;
    // css-loader 配置项
    cssLoader?: Record<string, any>;
    // less-loader 配置项
    lessLoader?: Record<string, any>;
    // style-resources-loader 配置项
    styleResourcesLoader?: Record<string, any>;
    // SWC loader 配置项
    swcLoader?: SwcLoaderOptions;
    // DefinePlugin 配置项
    definePlugin?: Record<string, string | Partial<Record<BuildTarget, string>>>;
    // 构建目标配置
    target?: {
        web?: string[];
        node?: string[];
    };
}
```

## 许可证

MIT