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

### cdnPublicPath
  - 说明：所有的静态资源，如果要添加 CDN 地址，直接在这里添加即可，仅在生产环境有效
  - 类型：`string`
  - 默认值：``
  - 例子：
```ts
const ssr = new SSR({
    cdnPublicPath: '//cdn.xxx.com'
});
```

### sandboxGlobal
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
    cdnPublicPath: '//cdn.xxx.com'
});
```