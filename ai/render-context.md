# RenderContext

## 核心概念

RenderContext 是 Gez 框架中的一个核心类，主要负责服务端渲染（SSR）过程中的资源管理和 HTML 生成。它具有以下核心特点：

1. **基于 ESM 的模块系统**
   - 采用现代的 ECMAScript Modules 标准
   - 支持原生的模块导入导出
   - 实现了更好的代码分割和按需加载

2. **智能依赖收集**
   - 基于实际渲染路径动态收集依赖
   - 避免不必要的资源加载
   - 支持异步组件和动态导入

3. **精确的资源注入**
   - 严格控制资源加载顺序
   - 优化首屏加载性能
   - 确保客户端激活（Hydration）的可靠性

4. **灵活的配置机制**
   - 支持动态基础路径配置
   - 提供多种导入映射模式
   - 适应不同的部署场景

通过这些特性，RenderContext 实现了高效的服务端渲染和流畅的客户端激活流程，为开发者提供了一个强大而灵活的 SSR 解决方案。

## 使用方式

在 Gez 框架中，开发者通常不需要直接创建 RenderContext 实例，而是通过 `gez.render()` 方法来获取实例：

```ts
async createServer(gez) {
    const server = http.createServer((req, res) => {
        // 静态文件处理
        gez.middleware(req, res, async () => {
            // 通过 gez.render() 获取 RenderContext 实例
            const rc = await gez.render({
                params: {
                    url: req.url
                }
            });
            // 响应 HTML 内容
            res.end(rc.html);
        });
    });
}
```

这种设计有以下优点：
- 简化了开发者的使用流程，无需关心 RenderContext 的具体实现
- 确保了 RenderContext 实例的正确初始化和配置
- 提供了统一的参数传递机制，方便在渲染过程中使用
- 内部实现了资源缓存和复用机制，优化性能

## 主要功能

### 1. 依赖收集

RenderContext 实现了一套智能的依赖收集机制，它基于实际渲染的组件来动态收集依赖，而不是简单地预加载所有可能用到的资源：

#### 按需收集
- 在组件实际渲染过程中自动追踪和记录模块依赖
- 只收集当前页面渲染时真正使用到的 CSS、JavaScript 等资源
- 通过 `importMetaSet` 精确记录每个组件的模块依赖关系
- 支持异步组件和动态导入的依赖收集

#### 自动化处理
- 开发者无需手动管理依赖收集过程
- 框架自动在组件渲染时收集依赖信息
- 通过 `commit()` 方法统一处理所有收集到的资源
- 自动处理循环依赖和重复依赖的问题

#### 性能优化
- 避免加载未使用的模块，显著减少首屏加载时间
- 精确控制资源加载顺序，优化页面渲染性能
- 自动生成最优的导入映射（Import Map）
- 支持资源预加载和按需加载策略

示例代码：
```ts
const renderToString = (app: any, context: { importMetaSet: Set<ImportMeta> }) => {
    // 在渲染过程中自动收集模块依赖
    // 框架会在组件渲染时自动调用 context.importMetaSet.add(import.meta)
    // 开发者无需手动处理依赖收集
    return '<div id="app">Hello World</div>';
};

// 使用示例
const app = createApp();
const html = await renderToString(app, {
    importMetaSet: rc.importMetaSet
});
```

### 2. 资源注入

RenderContext 提供了多个方法来注入不同类型的资源，每个方法都经过精心设计以优化资源加载性能：

- `preload()`：预加载 CSS 和 JS 资源，支持优先级配置
- `css()`：注入首屏样式表，支持关键 CSS 提取
- `importmap()`：注入模块导入映射，支持动态路径解析
- `moduleEntry()`：注入客户端入口模块，支持多入口配置
- `modulePreload()`：预加载模块依赖，支持按需加载策略

### 3. 资源注入顺序

RenderContext 严格控制资源注入顺序，这种顺序设计是基于浏览器的工作原理和性能优化考虑：

1. head 部分：
   - `preload()`：预加载 CSS 和 JS 资源，让浏览器尽早发现并开始加载这些资源
   - `css()`：注入首屏样式表，确保页面样式在内容渲染时就位

2. body 部分：
   - `importmap()`：注入模块导入映射，定义 ESM 模块的路径解析规则
   - `moduleEntry()`：注入客户端入口模块，必须在 importmap 之后执行
   - `modulePreload()`：预加载模块依赖，必须在 importmap 之后执行

这种顺序设计的技术原因：

1. **head 中的资源优先级**
   - preload 放在最前面可以让浏览器最早发现并开始下载关键资源
   - css 必须在 head 中以避免页面闪烁（FOUC）和重排
   - 这些资源会与 HTML 解析并行加载，优化首屏性能

2. **importmap 的关键位置**
   - 必须在所有模块加载之前完成导入映射的设置
   - 定义了 ESM 模块的路径解析规则和别名映射
   - 放在 body 中可以避免阻塞页面的首次渲染

3. **moduleEntry 的依赖关系**
   - 必须在 importmap 之后执行以确保正确的模块路径解析
   - 作为客户端代码的入口点，需要等待基础设施就绪
   - 控制了客户端激活（Hydration）的开始时机

4. **modulePreload 的执行时机**
   - 必须在 importmap 之后以使用正确的模块路径映射
   - 预加载后续可能用到的模块，提升运行时性能
   - 放在最后可以避免与首屏渲染竞争资源

这种精心设计的加载顺序不仅确保了资源的正确加载，还充分利用了浏览器的并行加载能力，实现了最优的性能表现。

## 完整渲染流程

一个典型的 RenderContext 使用流程如下：

```ts
export default async (rc: RenderContext) => {
    // 1. 渲染页面内容并收集依赖
    // 在渲染过程中，框架会自动收集实际使用到的模块依赖
   const app = createApp();
   const html = await renderToString(app, {
      importMetaSet: rc.importMetaSet
   });

    // 2. 提交依赖收集
    // 处理所有收集到的依赖，包括 CSS、JS 等资源
    await rc.commit();
    
    // 3. 生成完整 HTML
    // 注意：资源注入的顺序非常重要
    rc.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <!-- 预加载 CSS 和 JS 资源，提前开始加载以优化性能 -->
            ${rc.preload()}
            <!-- 注入首屏样式表，避免页面闪烁 -->
            ${rc.css()}
        </head>
        <body>
            ${html}
            <!-- 注入模块导入映射，定义 ESM 模块的路径解析规则 -->
            ${rc.importmap()}
            <!-- 注入客户端入口模块，必须在 importmap 之后执行 -->
            ${rc.moduleEntry()}
            <!-- 预加载模块依赖，基于实际渲染收集的依赖进行优化加载 -->
            ${rc.modulePreload()}
        </body>
        </html>
    `;
};
```

这个渲染流程展示了 RenderContext 的几个重要特性：

1. **智能依赖收集**：
   - 在组件实际渲染过程中自动收集使用到的模块依赖
   - 只处理当前页面需要的资源，避免不必要的加载
   - 支持异步组件和动态导入的依赖收集

2. **资源注入顺序**：
   - preload 和 css 在 head 中执行，确保资源尽早加载
   - importmap 必须在 moduleEntry 之前，提供正确的模块路径解析
   - modulePreload 在最后执行，必须在 importmap 之后，以确保正确的模块路径解析
   - 整个注入流程经过优化，最大限度利用浏览器的并行加载能力

## 最佳实践

1. 获取 RenderContext 实例
   - 始终通过 `gez.render()` 方法获取实例
   - 根据需要传入适当的参数，如 URL、基础路径等
   - 避免手动创建 RenderContext 实例
   - 合理利用实例缓存机制提升性能

2. 依赖收集
   - 确保所有模块都正确调用 `importMetaSet.add(import.meta)`
   - 在渲染完成后立即调用 `commit()` 方法
   - 合理使用异步组件和动态导入优化首屏加载
   - 注意处理循环依赖和重复依赖的情况

3. 资源注入
   - 严格遵循资源注入顺序
   - 不要在 body 中注入 CSS
   - 确保 importmap 在 moduleEntry 之前
   - 合理配置资源预加载策略

4. 性能优化
   - 使用 preload 预加载关键资源
   - 合理使用 modulePreload 优化模块加载
   - 避免不必要的资源加载
   - 利用浏览器缓存机制优化加载性能

## 基础路径配置

### 默认路径

RenderContext 默认会读取项目 `package.json` 的 `name` 字段来生成静态资产的基础路径：`/${name}/`。例如：

```json
{
    "name": "ssr-module-auth"
}
```

### 动态路径配置

RenderContext 提供了一个灵活的动态基础路径配置机制，通过构建时占位符和运行时替换的方式，实现了静态资源的动态加载。

#### 技术实现

1. **构建时处理**
   - 静态资源路径使用特殊占位符：`[[[___GEZ_DYNAMIC_BASE___]]]/${name}/`
   - 占位符会被注入到所有静态资源的引用路径中
   - 支持 CSS、JavaScript、图片等各类静态资源

2. **运行时替换**
   - 通过 `gez.render()` 的 `base` 参数设置实际基础路径
   - RenderContext 自动将 HTML 中的占位符替换为实际路径
   - 示例代码：
   ```ts
   const rc = await gez.render({
       base: '/gez',  // 设置基础路径
       params: {
           url: req.url
       }
   });
   ```

#### 应用场景

1. **多语言站点部署**
   - 二级目录方案：
     ```
     主域名.com      → 默认语言
     主域名.com/cn/  → 中文站点
     主域名.com/en/  → 英文站点
     ```
   - 独立域名方案：
     ```
     主域名.com    → 默认语言
     cn.域名.com   → 中文站点
     en.域名.com   → 英文站点
     ```

2. **微前端应用**
   - 支持子应用在不同路径下灵活部署
   - 便于集成到不同的主应用中
   - 简化了微前端架构的路由管理

#### 技术优势

1. **部署灵活性**
   - 同一套构建产物可部署到任意路径
   - 支持运行时动态切换基础路径
   - 无需针对不同部署路径重新构建

2. **性能优化**
   - 保持静态资源的最佳缓存策略
   - 避免了多环境构建的资源冗余
   - 减少了构建和部署的时间成本

3. **开发体验**
   - 简化了多环境配置管理
   - 提供统一的路径处理机制
   - 降低了部署和维护的复杂度

## 导入映射模式

RenderContext 提供了两种导入映射（Import Map）模式，以适应不同规模的应用需求：

### Inline 模式
- 将导入映射直接内联到 HTML 中
- 适合小型应用，减少额外的网络请求
- 页面加载时立即可用，无需等待额外加载
- 不支持动态更新映射

### JS 模式
- 通过外部 JavaScript 文件加载导入映射
- 适合大型应用，可以利用浏览器缓存机制
- 支持动态更新映射内容
- 可以根据需要延迟加载或预加载

### 使用场景

1. **小型应用**
   - 选择 Inline 模式
   - 模块依赖较少，映射内容较小
   - 追求更快的首屏加载速度
   - 映射内容相对稳定

2. **大型应用**
   - 选择 JS 模式
   - 模块依赖复杂，映射内容较大
   - 需要利用浏览器缓存优化性能
   - 可能需要动态更新映射

### 性能考虑

1. **Inline 模式**
   - 优点：减少网络请求，更快的首屏加载
   - 缺点：增加 HTML 文件大小，不利于缓存

2. **JS 模式**
   - 优点：可以利用浏览器缓存，支持动态更新
   - 缺点：额外的网络请求，可能影响首屏加载速度

## 总结
RenderContext 是 Gez 框架中实现高效服务端渲染的核心组件，通过精心设计的依赖收集和资源注入机制，为开发者提供了一个强大而灵活的 SSR 解决方案。它不仅优化了资源加载性能，还提供了灵活的配置选项和完善的开发体验。理解并正确使用 RenderContext 的各项功能，对于构建高性能的 SSR 应用至关重要。
