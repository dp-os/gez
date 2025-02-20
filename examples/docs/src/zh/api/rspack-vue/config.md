---
titleSuffix: Gez 框架 Vue 构建配置 API 参考
description: 详细介绍 Gez 框架的 RspackVueConfig 配置接口，包括 Vue Loader 的完整配置选项，帮助开发者自定义 Vue 项目的构建过程和开发环境。
head:
  - - meta
    - property: keywords
      content: Gez, RspackVueConfig, Vue Loader, 构建配置, Vue 2, Vue 3, Web 应用框架
---

# RspackVueConfig

## 类型定义

```ts
interface RspackVueAppOptions extends RspackHtmlAppOptions {
  /**
   * Vue Loader 配置
   * 透传 https://github.com/vuejs/vue-loader
   */
  vueLoader?: Record<string, any>;
}
```

## 配置项

### vueLoader

- 类型：`Record<string, any>`
- 默认值：`undefined`

Vue Loader 相关配置，支持所有 vue-loader 的配置项，详细配置请参考 [vue-loader 文档](https://github.com/vuejs/vue-loader)。