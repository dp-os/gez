# HTML

Gez 提供了一个基于原生 HTML、CSS 和 JavaScript 的服务端渲染示例项目，用于演示和学习 SSR 的基本原理。这个示例项目非常适合：

- 快速构建简单的服务端渲染页面
- 学习和理解 SSR 的基本原理
- 不依赖特定前端框架的项目

## 项目结构

一个典型的 HTML 项目结构如下：

```bash
src/
├── components/     # 组件目录
├── views/          # 页面视图
├── styles/         # 样式文件
├── entry.client.ts # 客户端入口
├── entry.server.ts # 服务端入口
├── entry.node.ts   # Node 配置入口
├── page.ts         # 页面基类
└── routes.ts       # 路由配置
```

## 服务端渲染

### 页面基类

所有页面都需要继承 `Page` 基类，它提供了生命周期钩子和状态管理：

```ts title="src/page.ts"
export class Page {
    // 页面标题
    public title = 'Gez';
    // 页面状态
    public state = {};
    // 页面属性
    public props = {};
    // 模块依赖收集
    public importMetaSet?: Set<ImportMeta>;

    // 生命周期钩子：创建时
    public onCreated() {}
    // 生命周期钩子：服务端渲染时
    public async onServer() {}
    // 生命周期钩子：客户端激活时
    public async onClient() {}
    // 渲染方法
    public render(): string {
        return '';
    }
}
```

### 服务端入口

服务端入口文件负责页面的服务端渲染：

```ts title="src/entry.server.ts"
import type { RenderContext } from '@gez/core';
import { getRoutePage } from './routes';

export default async (rc: RenderContext) => {
    // 获取页面组件
    const Page = await getRoutePage(new URL(rc.params.url, 'file:').pathname);
    const page = new Page();

    // 设置页面属性
    page.importMetaSet = rc.importMetaSet;
    page.props = {
        url: rc.params.url,
        base: rc.params.base || '/'
    };

    // 执行生命周期钩子
    page.onCreated();
    await page.onServer();
    const html = page.render();

    // 提交模块依赖收集
    await rc.commit();

    // 生成完整 HTML
    rc.html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    ${rc.preload()}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    ${rc.css()}
</head>
<body>
    <div id="app">
        ${html}
    </div>
    ${rc.state('__INIT_PROPS__', page.props)}
    ${rc.state('__INIT_STATE__', page.state)}
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>
`;
};
```

### 路由配置

使用 `routes.ts` 配置页面路由：

```ts title="src/routes.ts"
import type { Page } from './page';

// 路由映射
const routes: Record<string, () => Promise<{ default: typeof Page }>> = {
    '/': () => import('./views/home'),
    '/about': () => import('./views/about')
};

// 获取路由页面
export async function getRoutePage(pathname: string) {
    const route = routes[pathname] || routes['/'];
    const module = await route();
    return module.default;
}
```

## 客户端激活

客户端入口文件负责激活服务端渲染的页面：

```ts title="src/entry.client.ts"
import { getRoutePage } from './routes';

// 获取初始化数据
const props = (window as any).__INIT_PROPS__;
const state = (window as any).__INIT_STATE__;

// 激活页面
async function hydrate() {
    const Page = await getRoutePage(new URL(props.url, 'file:').pathname);
    const page = new Page();

    // 恢复状态
    page.props = props;
    page.state = state;

    // 执行客户端生命周期
    page.onCreated();
    await page.onClient();
}

hydrate();
```

## 最佳实践

1. **组件化开发**
   - 将页面拆分为可复用的组件
   - 组件放在 `components` 目录下
   - 每个组件负责特定的功能

2. **状态管理**
   - 使用 `page.state` 管理页面状态
   - 在 `onServer` 中初始化服务端状态
   - 在 `onClient` 中处理客户端交互

3. **样式管理**
   - 使用 CSS 模块化
   - 样式文件放在 `styles` 目录下
   - 避免全局样式污染

4. **性能优化**
   - 使用 `rc.preload()` 预加载资源
   - 合理使用 `importMetaSet` 收集依赖
   - 避免不必要的客户端 JavaScript

## 示例

### 首页组件

```ts title="src/views/home.ts"
import { Page } from '../page';

export default class HomePage extends Page {
    public title = '首页';

    public async onServer() {
        // 服务端数据获取
        this.state.message = '欢迎使用 Gez';
    }

    public render() {
        return `
            <div class="home">
                <h1>${this.state.message}</h1>
                <p>这是一个使用 Gez HTML 框架的示例页面</p>
            </div>
        `;
    }
}
```

### 关于页面

```ts title="src/views/about.ts"
import { Page } from '../page';

export default class AboutPage extends Page {
    public title = '关于';

    public render() {
        return `
            <div class="about">
                <h1>关于我们</h1>
                <p>Gez 是一个现代化的 SSR 框架</p>
            </div>
        `;
    }
}
```