# Babel

程序没有提供对应的参数配置，只能以插件的形式去修改[Babel](https://www.babeljs.cn/)的配置。

```ts
import { SSR, Plugin, BabelConfig } from '@fmfe/genesis-core';

class MyPlugin extends Plugin {
    public babel(config: BabelConfig) {
        // config.presets
        // config.plugins
        // 修改的例子
        config.presets.forEach((preset) => {
            if (Array.isArray(preset) && preset[0] === '@babel/preset-env') {
                // 修改 babel preset-env 配置
            }
        });
    }
}

```
因为`babel`钩子，只在开发阶段和编译阶段调用，所以我们只在`genesis.dev.ts` 和 `genesis.build.ts` 使用这个插件

```ts
ssr.plugin.use(MyPlugin);
```