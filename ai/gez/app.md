# App

## 概述

App 是 Gez 框架的应用抽象，提供了统一的接口来管理应用的生命周期、静态资源和服务端渲染。本文档详细说明 App 的核心功能和使用方法。

## 核心功能

### 1. 静态资源处理（middleware）

```typescript
interface App {
    middleware: Middleware;
    render: (options?: RenderContextOptions) => Promise<RenderContext>;
    build?: () => Promise<boolean>;
    destroy?: () => Promise<boolean>;
}
```

middleware 是一个静态资源处理中间件，根据运行环境提供不同实现：

**开发环境**
- 处理源码的静态资源请求
- 支持实时编译和热更新
- 使用 no-cache 缓存策略

**生产环境**
- 处理构建后的静态资源
- 支持不可变文件的长期缓存
- 优化的资源加载策略

示例：
```typescript
const server = http.createServer((req, res) => {
    // 静态资源处理
    gez.middleware(req, res, async () => {
        const rc = await gez.render({ url: req.url });
        res.end(rc.html);
    });
});
```

### 2. 服务端渲染（render）

render 函数负责执行服务端渲染，根据环境提供不同实现：

**开发环境**
- 加载源码中的服务端入口文件
- 支持热更新和实时预览
- 提供开发时的调试信息

**生产环境**
- 加载构建后的服务端入口文件
- 优化的渲染性能
- 支持缓存和复用

示例：
```typescript
const rc = await gez.render({
    url: '/page',
    state: { user: 'admin' }
});
res.end(rc.html);
```

### 3. 构建功能（build）

build 函数用于生产环境构建：
- 打包和优化资源
- 生成服务端代码
- 创建资源映射文件

### 4. 资源清理（destroy）

destroy 函数用于清理资源：
- 关闭服务器连接
- 清理临时文件
- 释放系统资源

## 使用场景

### 1. 基础 HTML 应用

```typescript
export default {
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez)
        );
    }
}
```

### 2. Vue2 微前端应用

```typescript
export default {
    async createDevApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez)
        );
    }
}
```

### 3. Preact 应用

```typescript
export default {
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez)
        );
    }
}
```

## 最佳实践

1. **资源管理**
   - 使用合适的缓存策略
   - 优化资源加载顺序
   - 实现按需加载

2. **性能优化**
   - 启用资源压缩
   - 配置合理的缓存
   - 优化渲染流程

3. **开发体验**
   - 使用热更新
   - 提供错误提示
   - 支持源码映射
