# Webpack
如果你想去修改[Webpack](https://webpack.js.org/)的配置，只能通过插件的形式进行修改，只提供了[webpack-chain](https://github.com/neutrinojs/webpack-chain#readme)来操作[Webpack](https://webpack.js.org/)的配置

```ts
import { SSR, Plugin } from '@fmfe/genesis-core';

class MyPlugin extends Plugin {
    /**
     * 修改webpack的配置
     */
    public chainWebpack(config: Genesis.WebpackHookParams) {}
}

const ssr = new SSR();
// 添加一个插件
ssr.plugin.use(new MyPlugin(ssr));

```