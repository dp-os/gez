import type { RenderContext } from '@gez/core';
import type { PageProps } from './page';
import { getRoutePage } from './routes';

export default async (rc: RenderContext) => {
    const props: PageProps = {
        url: rc.params.url
    };
    const htmlBase = rc.params.htmlBase ?? '';
    const pathname = new URL(rc.params.url, 'file:').pathname;
    const script = await rc.script();
    const Page = await getRoutePage(pathname);
    const page = new Page(props);

    // 在服务端请求数据
    await page.onServer();

    rc.html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gez</title>
</head>
<body>
    <div id="app">
        ${page.render().replaceAll(`{{__HTML_BASE__}}`, htmlBase)}
    </div>
    <script>
        window.__INIT_PROPS__ = ${rc.serialize(props, { isJSON: true })}
        window.__INIT_STATE__ = ${rc.serialize(page.state, { isJSON: true })}
    </script>
    ${script}
</body>
</html>
`;
};
