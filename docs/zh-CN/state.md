# 状态管理
在使用服务端渲染时，我们会在服务端填充数据，然后在客户端读取这些数据，我们一般会使用`Vuex`，所以下面的例子我们就以`Vuex`作为例子。

我们需要两个步骤

## 服务端设置状态
我们只需要在`renderContext.data.state`对象上设置你的状态即可，Genesis会把这个对象的可序列化内容下发到客户端
```ts
export default async (renderContext: RenderContext): Promise<Vue> => {
    const app = new Vue({
        store,
        // options
    });
    renderContext.beforeRender(() => {
        renderContext.data.state.vuexState = app.$store.state;
    });
});
```

## 客户端读取状态
在`clientOptions.state`对象上，可以拿到服务端的`renderContext.data.state`对象，这样我们就可以把状态设置给`Vuex`了
```ts
export default async (clientOptions: ClientOptions): Promise<Vue> => {

    store.replaceState(clientOptions.state.vuexState);

    const app = new Vue({
        store,
        // options
    });
});
```

你也可以在服务端的`state`上面写入一些其它的状态，然后在客户端读取，它的作用不仅仅只是给`Vuex`使用的