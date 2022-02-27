# Webpack

如果你想去修改[Webpack](https://webpack.js.org/)的配置，只能通过插件的形式进行修改，只提供了[webpack-chain](https://github.com/neutrinojs/webpack-chain#readme)来操作[Webpack](https://webpack.js.org/)的配置

```ts
import { SSR, Plugin, WebpackHookParams } from '@fmfe/genesis-core';

class MyPlugin extends Plugin {
    /**
     * 修改webpack的配置
     */
    public chainWebpack(config: WebpackHookParams) {}
}

```

因为`chainWebpack`钩子，只在开发阶段和编译阶段调用，所以我们只在`genesis.dev.ts` 和 `genesis.build.ts` 使用这个插件

```ts
ssr.plugin.use(MyPlugin);
```