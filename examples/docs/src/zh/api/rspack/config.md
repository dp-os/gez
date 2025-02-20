# RspackConfig

## 类型定义

```ts
interface RspackConfig {
  /**
   * 构建配置
   */
  build?: RspackBuildConfig;
  /**
   * 开发服务器配置
   */
  server?: RspackServerConfig;
}
```

## 配置项

### build

构建相关配置，详见 [RspackBuildConfig](/api/rspack/build-config)

### server

开发服务器相关配置，详见 [RspackServerConfig](/api/rspack/server-config)