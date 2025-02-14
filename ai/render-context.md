# RenderContext

## 核心概念

RenderContext 是 Gez 框架中的一个核心类，主要负责服务端渲染（SSR）过程中的资源管理和 HTML 生成。它提供了一套完整的机制来处理模块依赖收集、资源注入和 HTML 文档组装。

## 主要功能

### 1. 依赖收集

RenderContext 通过 `commit()` 方法实现依赖收集，主要包括：

- 使用 `importMetaSet` 收集模块依赖
- 处理 CSS、JavaScript 和其他资源文件
- 生成导入映射（Import Map）

示例代码：
```ts
const renderToString = (importMetaSet: Set<ImportMeta>) => {
    // 在渲染过程中收集模块依赖
    importMetaSet.add(import.meta);
    return '<div id="app">Hello World</div>';
};
```

### 2. 资源注入

RenderContext 提供了多个方法来注入不同类型的资源：

- `preload()`：预加载 CSS 和 JS 资源
- `css()`：注入首屏样式表
- `importmap()`：注入模块导入映射
- `moduleEntry()`：注入客户端入口模块
- `modulePreload()`：预加载模块依赖

### 3. 资源注入顺序

为了确保最佳性能，RenderContext 严格按照以下顺序注入资源：

1. head 部分：
   - `preload()`：预加载 CSS 和 JS 资源
   - `css()`：注入首屏样式表

2. body 部分：
   - `importmap()`：注入模块导入映射
   - `moduleEntry()`：注入客户端入口模块
   - `modulePreload()`：预加载模块依赖

这种顺序设计的原因：
- preload 和 css 必须在 head 中，以优化资源加载和避免页面闪烁
- importmap 必须在 moduleEntry 之前，确保正确的模块路径解析
- modulePreload 放在最后，避免与首屏渲染竞争资源

## 完整渲染流程

一个典型的 RenderContext 使用流程如下：

```ts
export default async (rc: RenderContext) => {
    // 1. 渲染页面内容并收集依赖
    const html = renderToString(rc.importMetaSet);

    // 2. 提交依赖收集
    await rc.commit();
    
    // 3. 生成完整 HTML
    rc.html = `
        <!DOCTYPE html>
        <html>
        <head>
            ${rc.preload()}  <!-- 预加载 CSS 和 JS 资源 -->
            ${rc.css()}      <!-- 注入首屏样式表 -->
        </head>
        <body>
            ${html}
            ${rc.importmap()}    <!-- 注入模块导入映射 -->
            ${rc.moduleEntry()}  <!-- 注入客户端入口模块 -->
            ${rc.modulePreload()}  <!-- 预加载模块依赖 -->
        </body>
        </html>
    `;
};
```

## 最佳实践

1. 依赖收集
   - 确保所有模块都正确调用 `importMetaSet.add(import.meta)`
   - 在渲染完成后立即调用 `commit()` 方法

2. 资源注入
   - 严格遵循资源注入顺序
   - 不要在 body 中注入 CSS
   - 确保 importmap 在 moduleEntry 之前

3. 性能优化
   - 使用 preload 预加载关键资源
   - 合理使用 modulePreload 优化模块加载
   - 避免不必要的资源加载

## 注意事项

1. 资源路径处理
   - RenderContext 会自动处理基础路径（base）
   - 支持通过 `basePathPlaceholder` 进行路径替换

2. 导入映射
   - 支持 inline 和 js 两种模式
   - inline 模式直接将映射内联到 HTML 中
   - js 模式通过外部文件加载映射

## 总结

RenderContext 是 Gez 框架中实现高效服务端渲染的核心组件，通过精心设计的依赖收集和资源注入机制，为开发者提供了一个强大而灵活的 SSR 解决方案。理解并正确使用 RenderContext 的各项功能，对于构建高性能的 SSR 应用至关重要。