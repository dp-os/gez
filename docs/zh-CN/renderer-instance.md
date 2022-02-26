# Renderer
## 属性
### ssr
  - 说明：和渲染器绑定的SSR实例
  - 类型：`Genesis.SSR`
### clientManifest
  - 说明：客户端文件清单
  - 类型：`Genesis.ClientManifest`
### staticPublicPath
  - 说明：服务端静态资源的公共路径，如果你的ssr.name是`ssr-demo`，那么这个路径就是`/ssr-demo/`
  - 类型：`string`
### staticDir
  - 说明：编译完成后，静态资源放置的目录，这个一般会和`staticPublicPath`搭配使用，设置静态资源服务器
  - 类型：`string`
## 方法
### reload
  - 说明：热重载程序，开发阶段编译完成后，需要重载程序实现热更新，或者使用了`MF`插件，下载新的远程模块后，需要热重载程序
  - 类型：`reload(): void;`
### renderJson
  - 说明：将渲染的结果，使用json格式输出，方便你提供给其它的服务使用
  - 类型：`renderJson(options?: Genesis.RenderOptions<Genesis.RenderModeJson>): Promise<Genesis.RenderResultJson>;`
### renderHtml
  - 说明：将渲染的结果，直接输出html
  - 类型：`renderHtml(options?: Genesis.RenderOptions<Genesis.RenderModeHtml>): Promise<Genesis.RenderResultHtml>;`
### render
  - 说明：最底层的渲染API，`renderJson`和`renderHtml`就是在它的基础上封装的
  - 类型：`render<T extends Genesis.RenderMode = Genesis.RenderMode>(options?: Genesis.RenderOptions<T>): Promise<Genesis.RenderResult<T>>;`
### renderMiddleware
  - 说明：一个简单的渲染中间件，但是不提供SSR降级策略，不建议使用
  - 类型：`renderMiddleware(req: IncomingMessage, res: ServerResponse, next: (err: any) => void): Promise<void>;`
