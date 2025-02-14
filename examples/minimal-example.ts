import type { RenderContext } from '@gez/core';

/**
 * 模拟框架的服务端渲染函数
 *
 * @description
 * 这个函数模拟了类似 Vue 的 renderToString 或 React 的 renderToString 的行为
 * 在实际应用中，这里会使用真实框架的渲染函数
 */
const renderToString = (importMetaSet: Set<ImportMeta>) => {
    // 模拟在渲染过程中收集模块依赖
    // 使用 import.meta 进行依赖收集
    importMetaSet.add(import.meta);

    // 返回渲染结果
    return '<div id="app">Hello World</div>';
};

/**
 * 最小的 RenderContext 使用示例
 *
 * @description
 * 这个示例展示了 RenderContext 的核心功能：
 * 1. 依赖收集：使用 commit() 收集所有需要的资源
 * 2. 资源注入：将收集到的 CSS、JS 等资源注入到 HTML 中
 * 3. HTML 生成：按照正确的顺序组装最终的 HTML 文档
 *
 * 资源注入顺序说明：
 * 1. preload() 和 css() 必须在 head 中：
 *    - preload() 越早执行，浏览器就能越早开始加载资源，提高页面加载性能
 *    - css() 必须在 head 中以避免页面闪烁（FOUC）和重排
 *
 * 2. importmap() 必须在 body 中且在 moduleEntry() 之前：
 *    - importmap 定义了 ESM 模块的路径映射规则
 *    - 客户端入口模块和其依赖都需要使用这些映射来正确加载
 *    - 放在 body 中可以避免阻塞页面的首次渲染
 *
 * 3. moduleEntry() 必须在 importmap() 之后：
 *    - 确保在执行模块代码前已经正确设置了导入映射
 *    - 避免模块加载失败或路径解析错误
 *
 * 4. modulePreload() 必须在 importmap() 和 moduleEntry() 之后：
 *    - modulePreload 会预加载模块的依赖，需要正确的路径解析
 *    - 如果在 importmap 之前执行，预加载请求可能使用错误的路径
 *    - 放在最后可以避免与首屏渲染竞争资源，优化用户体验
 */
export default async (rc: RenderContext) => {
    // 第一步：渲染页面内容
    // 在渲染过程中收集模块依赖
    const html = renderToString(rc.importMetaSet);
    // 注意：在实际应用中，renderToString 函数内部会通过 rc.importMetaSet.add(import.meta)
    // 来收集模块依赖，这里仅作示例

    // 第二步：提交依赖收集
    // 处理渲染过程中收集到的所有依赖
    await rc.commit();

    // 第三步：生成完整的 HTML
    // 按照最佳实践的顺序注入各种资源
    rc.html = `
        <!DOCTYPE html>
        <html>
        <head>
            ${rc.preload()}  <!-- 预加载 CSS 和 JS 资源 -->
            ${rc.css()}      <!-- 注入首屏样式表 -->
        </head>
        <body>
            ${html}
            ${rc.importmap()}    <!-- 注入模块导入映射，定义 ESM 模块的路径解析规则 -->
            ${rc.moduleEntry()}  <!-- 注入客户端入口模块，确保在导入映射之后执行 -->
            ${rc.modulePreload()}  <!-- 预加载模块依赖，放在最后以确保正确的路径解析 -->
        </body>
        </html>
    `;
};
