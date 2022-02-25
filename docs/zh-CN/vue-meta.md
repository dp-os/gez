# 管理HTML元数据
我们希望可以在组件中管理页面的元数据，比如页面的标题、描述和关键词等等，得益于社区开源的[vue-meta](https://vue-meta.nuxtjs.org)，我们可以很轻松的实现。

## 安装依赖
```bash
yarn add vue-meta
```

## 快速使用
```typescript
import Vue from 'vue';
import VueMeta from 'vue-meta';
 
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
});

```
```typescript
// Component.vue
{
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  }
}
```
上面是插件官方的标准用法，但是接入到Genesis中，还有些工作：
1. 需要在服务端获取vue-meta的配置
2. 需要将这些配置，传入到SSR的模板文件中
3. 自定义HTML模板，使用这些传入的变量

## 模板写入元数据
在服务端`entry-server.ts`文件添加逻辑，让我们在模板文件中写入meta
```javascript
export default async (renderContext: RenderContext): Promise<Vue> => {
    const app = new Vue();
    renderContext.beforeRender(() => {
        const {
            title,
            meta,
            link,
            style,
            script,
            htmlAttrs,
            headAttrs,
            bodyAttrs,
            base,
            noscript
        } = app.$meta().inject();
        // 在 index.html 文件中使用 <%- meta.title %>  就可以渲染出标题了，其它的举一反三
        Object.defineProperty(renderContext.data, 'meta', {
            enumerable: false,
            value: {
                title: title?.text() || '',
                meta: meta?.text() || '',
                link: link?.text() || '',
                style: style?.text() || '',
                script: script?.text() || '',
                htmlAttrs: htmlAttrs?.text() || '',
                headAttrs: headAttrs?.text() || '',
                bodyAttrs: bodyAttrs?.text() || '',
                base: base?.text() || '',
                noscript: noscript?.text() || ''
            }
        });
    });
});
```

## 模板读取元数据
项目根目录下创建`index.html`，读取上面写入的meta
```html
<!DOCTYPE html>
<html <%-meta.htmlAttrs%>>

<head <%-meta.bodyAttrs%>>
    <%-meta.meta%>
    <%-meta.title%>
    <%-meta.link%>
    <%-meta.style%>
    <%-style%>
</head>

<body <%-meta.headAttrs%>>
<%-html%>
<%-meta.noscript%>
<%-scriptState%>
<%-meta.script%>
<%-script%>
</body>

</html>
```
修改`genesis.ts`文件中`SSR`对象的选项
```javascript
export const ssr = new SSR({
    build: {
        template: path.resolve('index.html')
    }
});
```