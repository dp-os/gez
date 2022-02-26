# Webpack module federation
相信你能找到这里，说明你对`Webpack module federation`已经拥有了一定的了解，社区有很多教程告诉你怎么去使用它。如果你对它不是很了解，不妨先看看[官方的文档](https://webpack.docschina.org/concepts/module-federation/)


Genesis2.0 是目前Vue2在SSR方面，唯一支持`Webpack module federation`的框架，为什么呢？是因为Genesis1.0的时候，就提出了一个远程组件的概念，可以让不同的服务调用其它服务的页面。当我们看到Webpack提出`module federation`的概念时，就已经开始思考Genesis2.0的迭代了


直达今天，我们终于完成了全部的功能开发，并已经在公司内部的项目开始升级，将远程组件修改成新的`module federation`联邦的方式调用。在这个过程中，我们顺利解决了`module federation`对TS类型不支持的问题，并且可以对所有的`module federation`入口文件强缓存

