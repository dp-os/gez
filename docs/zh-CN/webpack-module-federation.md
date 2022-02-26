# Webpack module federation
相信你能找到这里，说明你对`Webpack module federation`已经拥有了一定的了解，社区有很多教程告诉你怎么去使用它。如果你对它不是很了解，不妨先看看[官方的文档](https://webpack.docschina.org/concepts/module-federation/)


Genesis2.0 是目前Vue2在SSR方面，唯一支持`Webpack module federation`的框架，为什么呢？是因为Genesis1.0的时候，就提出了一个远程组件的概念，可以让不同的服务调用其它服务的页面。当我们看到Webpack提出`module federation`的概念时，就已经开始思考Genesis2.0的迭代了


直达今天，我们终于完成了全部的功能开发，并已经在公司内部的项目开始升级，将远程组件修改成新的`module federation`联邦的方式调用。在这个过程中，我们顺利解决了`module federation`对TS类型不支持的问题，并且可以对所有的`module federation`入口文件强缓存

## Node端实现`module federation`原理
`module federation`在纯粹的`CSR`项目中比较容易实现，但是在`SSR`项目中需要在服务端运行一个Node程序，目前`Webpack`对此并没有一个好的解决方案，所以在服务端实现`module federation`。

如果你的项目导出了远程模块，在`client`的文件夹中会多出一个`node-exposes`文件夹，让我们来看看这几个文件的作用都是什么吧。
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
- `d` 是用来判断当前服务是否生成了dts，如果为1的时候，其它服务端在开发阶段，程序会下载`e608c015-dts.zip`这个文件，并且解压到`node_modules`目录中
- `t` 是当前构建完成的时间戳，如果本地已经下载过远程模块，`MF`发送请求的时候会把这个`t`的参数带过去，通过比较两个不同的`t`值来判断是否发布了新的版本
