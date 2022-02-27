# MF
这是对`Webpack module federation`插件的封装，它使得你可以轻松的构建Vue SSR的`Module federation`应用程序
## 属性
### options
  - 说明：你传入的选项
  - 类型：`Required<Genesis.MFOptions>`
### exposes
  - 说明：当前服务导出操作的对象
  - 类型：`Exposes`
### exposes.manifest
  - 说明：当前服务导出模块的清单内容
  - 类型：`Genesis.MFManifestJson`
### remote
  - 说明：当前服务远程模块操作的对象
  - 类型：`RemoteGroup`
### entryName
  - 说明：模块联邦文件导出的名称
  - 类型：`string`
### haveExposes
  - 说明：判断服务是否有导出的文件
  - 类型：`boolean`
### varName
  - 说明：全局变量注入的名称
  - 类型：`string`
### output
  - 说明：`MF`相关内容编译后输出的目录
  - 类型：`string`
### outputManifest
  - 说明：`MF`输出的清单文件地址，`MF`就是判断这个文件变化来更新远程模块内容
  - 类型：`string`
### manifestRoutePath
  - 说明：`MF`的清单文件，路由访问的地址
  - 类型：`string`
## 方法
### getWebpackPublicPathVarName
  - 说明：获取注入全局对象的变量名称
  - 类型：`getWebpackPublicPathVarName(name: string): string;`
### exposes.watch
  - 说明：监听导出的内容是否有变化，如果有变化，则会触发回调
  - 类型：`watch(cb: ExposesWatchCallback): () => void;`
### exposes.getManifest
  - 说明：获取导出的清单文件，如果没有变化的话，就等待一段时间，超过时间限制，则响应，如果有变化则立即响应。
  - 类型：`getManifest(t?: number, maxAwait?: number): Promise<ManifestJson>;`
### exposes.emit
  - 说明：提交导出的模块信息有变更
  - 类型：`emit(): void;`
### remote.inject
  - 说明：远程模块需要在HTML中注入的内容，你不需要自己手动注入，`MF`插件会自动注入
  - 类型：`inject(): string;`
### remote.init
  - 说明：远程模块初始化方法，提前初始化，可以在用户访问的时候更快的下载完成远程的模块
  - 类型：`init(...args: Parameters<Remote['init']>): Promise<void[]>;`
### remote.fetch
  - 说明：你可以在`npm`的`postinstall`钩子中调用这个方法，在安装依赖的时候就能下载远程模块和它提供的TS类型包，这样本地开发时，不需要启动程序，也可以获取正确远程模块TS类型，如果传入名称，则只拉取某个服务的远程模块
  - 类型：`fetch(name?:string): Promise<boolean[]>;`
### remote.polling
  - 说明：启动一个监听程序，不断的轮询远程模块的`manifest.son`文件是否变化，如果发生变化，就会下载新的模块，并且热重载程序
  - 类型：`polling(): Promise<void[]>;`
### remote.polling
  - 说明：停止监听程序
  - 类型：`stopPolling(): Promise<void[]>;`