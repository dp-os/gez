# VueConfig

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