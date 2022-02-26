# SSR
## 属性
```ts
const ssr = new SSR();
// 属性
console.log(ssr.name);

```
### Renderer
  - 说明：渲染器，执行`ssr.createRenderer()`方法时使用
  - 类型：`typeof Renderer`

### options
  - 说明：`new SSR({})`传进来的选项
  - 类型：`Genesis.Options`
### plugin
  - 说明：插件系统
  - 类型：`Genesis.PluginManage`
### entryName
  - 说明：编译时，导出的文件名称，会传递给Webpack使用
  - 类型：`string`
### sandboxGlobal
  - 说明：在Vue程序运行时，传递给VM的全局对象
  - 类型：`Record<string, any>`

### isProd
  - 说明：判断是否是生产环境
  - 类型：`boolean`
### name
  - 说明：当前应用的名称
  - 类型：`string`
### extractCSS
  - 说明：是否抽取CSS文件
  - 类型：`boolean`
### publicPath
  - 说明：静态资源的公共的路径
  - 类型：`string`
### publicPathVarName
  - 说明：公共路径，注入到window或者global的属性名称
  - 类型：`string`
### cdnPublicPath
  - 说明：静态资源的CDN域名地址
  - 类型：`string`
### baseDir
  - 说明：项目目录所在的位置
  - 类型：`string`
### outputDir
  - 说明：输出目录所在的位置
  - 类型：`string`
### outputDirInTemplate
  - 说明：模板文件输出的目录
  - 类型：`string`
### outputDirInClient
  - 说明：客户端资源，输出的目录
  - 类型：`string`
### outputDirInServer
  - 说明：服务端资源，输出的目录
  - 类型：`string`
### srcDir
  - 说明：源码文件所在的目录
  - 类型：`string`
### srcIncludes
  - 说明：源码文件，包含了哪些目录
  - 类型：`(string | RegExp)[]`
### transpile
  - 说明：编译文件的配置规则
  - 类型：`(string | RegExp)[]`
### entryClientFile
  - 说明：客户端的程序入口文件
  - 类型：``
### entryServerFile
  - 说明：服务端的程序入口文件
  - 类型：`string`
### outputClientManifestFile
  - 说明：客户端清单文件输出的文件地址
  - 类型：`string`
### outputServeAppFile
  - 说明：构建生产文件后，服务端程序执行的入口文件
  - 类型：`string`
### templateFile
  - 说明：HTML模板的文件地址
  - 类型：`string`
### outputTemplateFile
  - 说明：编译后，输出的模板文件地址
  - 类型：`string`
## 方法
### getBuildTarget
  - 说明：获取编译的目标
  - 类型：`getBuildTarget(env: keyof Genesis.Target): string`
### createRenderer
  - 说明：创建Renderer的实例
  - 类型：`createRenderer(): Renderer`