# Webpack module federation
相信你能找到这里，说明你对`Webpack module federation`已经拥有了一定的了解，社区有很多教程告诉你怎么去使用它。如果你对它不是很了解，不妨先看看[官方的文档](https://webpack.docschina.org/concepts/module-federation/)


Genesis2.0 是目前Vue2在SSR方面，唯一支持`Webpack module federation`的框架，为什么呢？是因为Genesis1.0的时候，就提出了一个远程组件的概念，可以让不同的服务调用其它服务的页面。当我们看到Webpack提出`module federation`的概念时，就已经开始思考Genesis2.0的迭代了


直达今天，我们终于完成了全部的功能开发，并已经在公司内部的项目开始升级，将远程组件修改成新的`module federation`的方式调用。在这个过程中，我们顺利解决了`module federation`对TS类型不支持的问题，并且可以对所有的`module federation`入口文件强缓存

## Node端实现`module federation`原理
`module federation`在纯粹的`CSR`项目中比较容易实现，但是在`SSR`项目中需要在服务端运行一个Node程序，目前`Webpack`对此并没有一个好的解决方案，所以在服务端自己实现`module federation`下载和执行过程

### 编译阶段
如果你的项目导出了远程模块，在编译阶段`client`的文件夹中会多出一个`node-exposes`文件夹，让我们来看看这几个文件的作用都是什么吧。
![image](https://user-images.githubusercontent.com/8424643/155847418-172fc3ca-5499-4a95-a839-9a72104f52f0.png)

`manifest.json`    
这是一个清单文件，告诉了当前模块导出的基本信息
```json
{
    "c": "9fed5146",
    "s": "e608c015",
    "d": 1,
    "t": 1645870356360
}
```
- `c` 是指客户端`module federation`入口文件的版本号
- `s` 是指服务端`module federation`入口文件的版本号
- `d` 是用来判断当前服务是否生成了dts，1是生成
- `t` 是当前构建完成的时间戳，如果本地已经下载过远程模块，`MF`发送请求的时候会把这个`t`的参数带过去，通过比较两个不同的`t`值来判断是否发布了新的版本

`e608c015.zip`    
这是将构建出来的`server`目录下的全部内容，打包成的一个`zip`文件，放到`client/node-exposes`的目录中，方便其它的服务请求下载运行

`e608c015-dts.zip`
如果你给`MF`插件指定了类型文件生成的目录，插件便会生成一个`zip`文件，这样其它服务端在开发阶段，程序会下载`e608c015-dts.zip`这个文件，并且解压到`node_modules`目录中，就能得到完整的TS类型支持

### 运行阶段
![image](https://user-images.githubusercontent.com/8424643/155848245-0648d356-91aa-4672-8eea-4cea2a714c02.png)
在程序运行的时候，`MF`就会去下载远程模块的代码，你会在控制台看到类似这样的一个日志

![image](https://user-images.githubusercontent.com/8424643/155848316-ac6040a4-5f6b-4562-a54a-30e80f4fb324.png)

远程模块下载完成后，会解压`zip`文件，就能看到上图`Hot update`的字样，程序会热重载最新的代码执行。整个`SSR`渲染的程序，会放在一个`Node VM`中运行，能够有效的解决服务热重载时的内存泄漏问题。当然了，如果像定时器这种，如果不清理，还是会发生内存泄漏的，因为在`ssr.sandboxGlobal`注入了全局的定时器相关的函数。

### 轮询阶段
在服务运行的过程中，如果远程服务发布了新的版本，这个时候我们就需要热更新了，`MF`提供了轮询的方法，所以在`host端`代码看起来像是下面这样的
```ts
/**
 * 拿到渲染器后，启动应用程序
 */
export const startApp = (renderer: Renderer) => {
    /**
     * 初始化远程模块
     */
    mf.remote.init(renderer);
    /**
     * 轮询远程模块
     */
    mf.remote.polling();
    /**
     * 使用默认渲染中间件进行渲染，你也可以调用更加底层的 renderer.renderJson 和 renderer.renderHtml 来实现渲染
     */
    app.use(renderer.renderMiddleware);
    /**
     * 监听端口
     */
    app.listen(3001, () => console.log(`http://localhost:3001`));
};

```
为了保证模块的及时性，`MF`默认的轮询间隔时间为`1000ms`，这个轮询的时间太频繁了，所以我们也可以在`remote`端适当的延长响应的时间，避免请求过于频繁
```ts
/**
 * 重写 manifest.json 的响应逻辑，注意要在静态服务的请求之前添加处理函数
 * 如果1分钟内有更新，则立即往下执行，响应请求
 * 如果1分钟内没有更新，则再结束请求，避免对方太频繁轮询
 */
app.get(mf.manifestRoutePath, async (req, res, next) => {
    // host端传过来的编译时间
    const t = Number(req.query.t);
    // 最大等待时间
    const maxAwait = 1000 * 60;
    // 尝试等待manifest.json新的文件
    await mf.exposes.getManifest(t, maxAwait);
    // 继续往下执行，读取真实的静态资源文件
    next();
});
```