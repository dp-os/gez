---
titleSuffix: Gez 框架 Rspack 构建配置 API 参考
description: 详细介绍 Gez 框架的 RspackConfig 配置接口，包括构建和开发服务器的完整配置选项，帮助开发者自定义项目的构建过程和开发环境。
head:
  - - meta
    - property: keywords
      content: Gez, RspackConfig, Rspack, 构建配置, 开发服务器, Web 应用框架
---

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