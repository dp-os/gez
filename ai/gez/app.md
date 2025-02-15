# App

## 概述

App 是 Gez 框架的应用抽象，提供了统一的接口来管理应用的生命周期、静态资源和服务端渲染。

## 接口定义

```typescript
interface App {
    middleware: Middleware;
    render: (options?: RenderContextOptions) => Promise<RenderContext>;
    build?: () => Promise<boolean>;
    destroy?: () => Promise<boolean>;
}
```

### middleware

静态资源处理中间件，根据运行环境提供不同实现：

**开发环境**
- 处理源码的静态资源请求
- 支持实时编译和热更新
- 使用 no-cache 缓存策略

**生产环境**
- 处理构建后的静态资源
- 支持不可变文件的长期缓存（.final.xxx）
- 优化的资源加载策略

```typescript
// entry.node.ts
async createServer(gez) {
    const server = http.createServer((req, res) => {
        // 处理静态资源请求
        // 开发环境：源码 + 热更新
        // 生产环境：构建产物 + 长期缓存
        gez.middleware(req, res, async () => {
            // 处理其他请求
        });
    });
}
```

### render

服务端渲染函数，根据运行环境提供不同实现：
- 生产环境（start）：加载构建后的服务端入口文件（entry.server）执行渲染
- 开发环境（dev）：加载源码中的服务端入口文件执行渲染

```typescript
// 生产环境
const rc = await gez.render({
    params: { url: '/page' }
});
res.end(rc.html);
```

### build

生产环境构建函数，用于资源打包和优化。

### destroy

资源清理函数，用于关闭服务器、断开连接等。

## 应用创建

```typescript
async function createApp(gez: Gez, command: COMMAND): Promise<App> {
    const render =
        command === gez.COMMAND.start
            ? await createStartRender(gez)  // 生产环境
            : createErrorRender(gez);       // 开发环境
    return {
        middleware: createMiddleware(gez),
        render
    };
}
```

## 使用场景

### 1. 基础 HTML 应用

```typescript
export default {
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                config(rc) {
                    // Rspack 配置
                }
            })
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
    },
    modules: {
        imports: {
            'ssr-vue2-remote': 'root:./node_modules/ssr-vue2-remote/dist'
        },
        externals: {
            vue: 'ssr-vue2-remote/npm/vue'
        }
    }
}
```

### 3. Preact 应用

```typescript
export default {
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                config(rc) {
                    // Preact 配置
                }
            })
        );
    }
}
```

## 关键特性

1. **构建工具集成**
   - 动态导入构建工具
   - 支持 Rspack 配置
   - 开发环境优化

2. **静态资源处理**
   - 模块化的资源管理
   - 缓存控制
   - 不可变文件支持

3. **服务端渲染**
   - 环境感知的渲染实现
   - 统一的渲染接口
   - 上下文管理

4. **模块系统**
   - 模块导入导出
   - 依赖共享
   - 外部依赖映射

## 最佳实践

1. **开发环境**
   - 使用动态导入构建工具
   - 合理配置缓存策略
   - 实现自定义渲染函数

2. **生产环境**
   - 优化静态资源
   - 实现服务端渲染
   - 配置长期缓存

3. **模块管理**
   - 明确模块边界
   - 规范依赖管理
   - 优化资源加载

## 注意事项

1. **构建工具**
   - 开发依赖需要动态导入
   - 避免生产环境依赖
   - 保持配置简洁

2. **静态资源**
   - 遵循不可变文件命名规范
   - 合理设置缓存策略
   - 优化资源加载

3. **服务端渲染**
   - 区分开发和生产环境
   - 正确处理渲染上下文
   - 注意错误处理
