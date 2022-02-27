# Postcss

程序没有提供对应的参数配置，只能以插件的形式去修改[Postcss](https://www.npmjs.com/package/postcss-loader)的配置。

```ts
import { SSR, Plugin, PostcssOptions } from '@fmfe/genesis-core';

class MyPlugin extends Plugin {
    public postcss(config: PostcssOptions) {
        config.plugins.push({
            // 插件
        });
    }
}

```
因为`postcss`钩子，只在开发阶段和编译阶段调用，所以我们只在`genesis.dev.ts` 和 `genesis.build.ts` 使用这个插件

```ts
ssr.plugin.use(MyPlugin);
```