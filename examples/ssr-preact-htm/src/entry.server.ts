import type { RenderContext } from '@gez/core';
import { render } from 'preact-render-to-string';
import { App } from './app';

export default async (rc: RenderContext) => {
    // 渲染页面内容
    const html = render(App());

    // 提交模块依赖收集
    await rc.commit();

    rc.html = `
<!DOCTYPE html>
<html>
<head>
    ${rc.preload()}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gez</title>
    ${rc.css()}
</head>
<body>
    <div id="app">
        ${html}
    </div>
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>
`;
};
