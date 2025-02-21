/**
 * @file 服务端渲染入口文件
 * @description 负责服务端渲染流程、HTML 生成和资源注入
 */

import type { RenderContext } from '@gez/core';

// 模拟 renderToString 函数，生成页面内容
const renderToString = () => {
    const time = new Date().toISOString();
    return `
    <h1><a href="https://www.gez-esm.com/guide/start/getting-started.html" target="_blank">Gez 快速开始</a></h1>
    <time datetime="${time}">${new Date(time).toLocaleString('zh-CN')}</time>
    `;
};

export default async (rc: RenderContext) => {
    // 使用 renderToString 生成页面内容
    const html = renderToString();

    // 提交依赖收集，确保所有必要资源都被加载
    await rc.commit();

    // 生成完整的 HTML 结构
    rc.html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    ${rc.preload()}
    <title>Gez 快速开始</title>
    ${rc.css()}
</head>
<body>
    ${html}
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>
`;
};
