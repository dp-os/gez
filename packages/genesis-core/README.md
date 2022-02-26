# @fmfe/genesis-core
这是`Genesis`的核心库，提供了`SSR`、`Renderer`和`MF`

## SSR
### Options
```ts
const ssr = new SSR({
    // options
});
```
#### name
  - 说明：应用名称，如果你的页面有多个`ssr`实例，需要使用不同的名称区分它。
  - 类型：`string`
  - 默认值：`ssr-genesis`
  - 例子：
```ts
const ssr = new SSR({
    name: 'ssr-genesis'
});
```

#### isProd
  - 说明：设置程序的运行模式
  - 类型：`boolean`
  - 默认值：`process.env.NODE_ENV === 'production'`
  - 例子：
```ts
const ssr = new SSR({
    isProd: process.env.NODE_ENV === 'production'
});
```

#### cdnPublicPath
  - 说明：所有的静态资源，如果要添加 CDN 地址，直接在这里添加即可，仅在生产环境有效
  - 类型：`string`
  - 默认值：``
  - 例子：
```ts
const ssr = new SSR({
    cdnPublicPath: '//cdn.xxx.com'
});
```

#### sandboxGlobal
  - 说明：在沙盒环境中添加全局变量
  - 类型：`Record<string, any>`
  - 默认值：
```ts
{
    Buffer,
    console,
    process,
    setTimeout,
    setInterval,
    setImmediate,
    clearTimeout,
    clearInterval,
    clearImmediate,
    URL
}
``` 
  - 例子：
```ts
const ssr = new SSR({
    sandboxGlobal: {
      text: 'Hi'
      // 注入全局变量，在Vue程序中，使用global.text即可获取到
    }
});

```

#### build.extractCSS
  - 说明：仅在生产环境时生效，在生产环境时，默认会抽离CSS文件，如果你使用了`MF`插件，则需要设置为`false`
  - 类型：`boolean`
  - 默认值：`this.isProd`
  - 例子：
```ts
const ssr = new SSR({
    build: {
      extractCSS: false
    }
});
```

#### build.baseDir
  - 说明：项目目录，程序会将目录下的`src`和`dist`目录分别作为源码和构建输出的目录
  - 类型：`string`
  - 默认值：`path.resolve()`
  - 例子：
```ts
const ssr = new SSR({
    build: {
      baseDir: path.resolve()
    }
});
```
#### build.transpile
  - 说明：默认的情况下，会忽略`node_modules`的编译，如果你希望编译一些项目`src`目录之外的，可以配置绝对路径或使用正则匹配
  - 类型：`(RegExp | string)[]`
  - 默认值：`[]`
  - 例子：
```ts
const ssr = new SSR({
    build: {
      transpile: path.resolve('node_modules/[package]/src/')
    }
});
```
#### build.alias
  - 说明：创建 import 或 require 的别名，来确保模块引入变得更简单，查看[Webpack文档](https://webpack.docschina.org/configuration/resolve/#resolvealias)
  - 类型：`Record<string, string>`
  - 默认值：`{}`
  - 例子：
```ts
const ssr = new SSR({
    build: {
      alias: {
        '@': path.resolve('src')
      }
    }
});
```

#### build.fallback
  - 说明：当正常解析失败时，重定向模块请求，查看[Webpack文档](https://webpack.docschina.org/configuration/resolve/#resolvefallback)
  - 类型：`Record<string, string>`
  - 默认值：`{}`
  - 例子：
```ts
const ssr = new SSR({
    build: {
      fallback: {
        process: require.resolve('process/browser')
      }
    }
});
```

#### build.template
  - 说明：SSR 和 CSR 渲染的模板的地址，它使用了[ejs](https://github.com/mde/ejs)模板引擎，如果你配置了模板地址，就会使用你的模板地址，否则会使用默认模板。会尝试读取`项目目录/src/index.html`的文件，如果不存在则使用默认模板
  - 类型：`string`
  - 默认值：`path.resolve(this.srcDir, 'index.html')`
  - 例子：
```ts
const ssr = new SSR({
    build: {
      fallback: {
        process: require.resolve('process/browser')
      }
    }
});
```

#### build.target
  - 说明：告知 webpack 为目标(target)指定一个环境，查看[Webpack文档](https://webpack.docschina.org/configuration/target/#string)
  - 类型：`{ client?: string; server?: string; }`
  - 默认值：`{ client: 'web', server: 'node' }`
  - 例子：
```ts
const ssr = new SSR({
    build: {
      target: {
        client: 'web',
        server: 'node'
      }
    }
});
```
