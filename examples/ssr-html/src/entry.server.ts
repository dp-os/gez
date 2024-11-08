import type { RenderContext } from '@gez/core';
import { getRoutePage } from './routes';

export default async (rc: RenderContext) => {
    const htmlBase = rc.params.htmlBase ?? '';
    const pathname = new URL(rc.params.url, 'file:').pathname;
    const Page = await getRoutePage(pathname);
    const page = new Page([import.meta]);
    // 初始化
    page.props = {
        url: rc.params.url
    };
    page.onCreated();
    // 在服务端请求数据
    await page.onServer();

    await rc.bind(page.imports);

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
        ${page.render().replaceAll(`{{__HTML_BASE__}}`, htmlBase)}
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
