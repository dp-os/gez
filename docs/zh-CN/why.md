# 为什么使用Genesis？
这是一个好问题，社区有那么多微前端、SSR的解决方案了，为什么还要选择Genesis呢？

Genesis的诞生就是为了探索SSR微服务的架构，在经历了1.0的远程组件时代，到`Webpack module federation`时代，它将彻底的改变了我们以往代码的组织形式，原来通过包的形式来更新模块的时代一去不复返，取而代之的是模块即服务，服务即模块

## 什么是模块即服务?
传统的前端架构中，我们通常会有一个`lib-components`组件库、`lib-utils`工具库等等，然后需要的项目通过`npm`的形式安装，如果lib库有更新，所有依赖的项目都需要重新打包，如果有上百个项目依赖了它，这个过程将会变成沉重的发布压力。`模块即服务，是指将一个模块或多个模块，在一个模块中导出，部署到一个服务中`，需要用到的服务，则调用该服务提供的方法、组件等等。通过调用远程模块，可以有利于我们进行统一的版本管理，单独部署，单独发布，形成一个微服务架构


## 微服务架构
![image](https://user-images.githubusercontent.com/8424643/155875020-cb6b7eb6-65b2-42e6-b27a-62fd5b635cc9.png)

在后端的架构中，很容易实现将不同的路由，转发到不同的服务中，现在有了`Genesis`我们也可以做到，根据用户请求不同的路由，转发到不同的服务渲染HTML，但是客户端的时候，它又是一个整体，能够无刷新的切换到不同服务的页面，而实现这一切关键的秘诀就在于`module federation`     

一个SSR的应用程序，通常会分为`entry-client.ts`和`entry-server.ts`两个入口文件，我们可以在一个公共的服务中导出两个文件，一个是提供了完整的客户端运行函数，里面注册了全部服务的路由，另外一个文件则导出一个`createApp`的函数，可以传入一个路由的配置，在服务端运行的时候，我们只需要注册当前服务提供的路由即可

我们假设`ssr-mf-home`服务有这样的两个文件

`src/common/create-app.ts`
```ts
import { ClientOptions, RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';
import Meta from 'vue-meta';
import Router, { RouteConfig } from 'vue-router';

import App from './app.vue';

Vue.use(Meta).use(Router);

export function createApp(routes: RouteConfig[]) {
    return async (context: RenderContext | ClientOptions) => {
        const router = new Router({
            mode: 'history',
            routes
        });
        const url = context.env === 'client' ? context.url : context.data.url;
        await router.push(url);
        const app = new Vue({
            router,
            render(h) {
                return h(App);
            }
        });
        if (context.env === 'server') {
            context.beforeRender(() => {
                const { title, link, style, script, meta } = app
                    .$meta()
                    .inject();
                appendText(context.data, 'title', title?.text() ?? '');
                appendText(context.data, 'meta', meta?.text() ?? '');
                appendText(context.data, 'style', style?.text() ?? '');
                appendText(context.data, 'style', link?.text() ?? '');
                appendText(context.data, 'script', script?.text() ?? '');
            });
        }
        return app;
    };
}

function appendText(data: Record<string, string>, key: string, value: string) {
    if (typeof data[key] !== 'string') {
        data[key] = '';
    }
    if (value) {
        data[key] += value;
    }
}

```
`src/common/create-app-client.ts`
```ts
// 可以在这里，统一引入所有服务的路由配置
import { routes as about } from 'ssr-mf-about/src/routes';

import { routes as home } from '../routes';
import { createApp } from './common';

export default createApp([...home, ...about]);

```
上面的提供了一个`createApp`函数，接收的参数是一个路由配置，我们在服务端的时候，就可以使用`module federation`在`entry-server.ts`文件中执行这个方法，并传入当前的服务的路由，所以我们只需要在`entry-client.ts`和`entry-server.ts`分别注册不同的路由即可实现上述路由分发

让我们看看其它服务是怎么去使用它的
`entry-client.ts`
```ts
export { default } from 'ssr-mf-home/src/common/create-app-client';
```
客户端的入口文件，我们直接返回公共服务提供的统一`createApp`方法


`entry-server.ts`
```ts
import { createApp } from 'ssr-mf-home/src/common/create-app';

import { routes } from './routes';

export default createApp(routes);

```
服务端入口文件，则只创建当前服务的路由

这里提供了完整的demo，有兴趣的可以看看代码
- [ssr-mf-home](https://github.com/fmfe/genesis/tree/master/examples/ssr-mf-home)
- [ssr-mf-about](https://github.com/fmfe/genesis/tree/master/examples/ssr-mf-about)