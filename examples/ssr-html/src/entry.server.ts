import type { PackageJson, RenderContext } from '@gez/core';
import type { PageProps } from './page';
import { getRoutePage } from './routes';

async function render(this: RenderContext, imports: ImportMeta[]) {
    const packages = await this.getPackagesJson();
    const set = new Set<string>();
    imports.forEach((item) => {
        if ('buildFrom' in item && Array.isArray(item.buildFrom)) {
            item.buildFrom.forEach((item) => set.add(item));
        }
    });
    const jsArr: string[] = [];
    const cssArr: string[] = [];
    const resources: string[] = [];

    packages.forEach((item) => {
        Object.entries(item.build).forEach(([filepath, info]) => {
            if (set.has(filepath)) {
                if (!jsArr.includes(info.js)) {
                    jsArr.push(info.js);
                }
                info.css.forEach((css) => {
                    if (!cssArr.includes(css)) {
                        cssArr.push(css);
                    }
                });
                info.resources.forEach((resource) => {
                    if (!resources.includes(resource)) {
                        resources.push(resource);
                    }
                });
            }
        });
    });
    console.log(jsArr, cssArr, resources);
    return {};
}

export default async (rc: RenderContext) => {
    const props: PageProps = {
        url: rc.params.url
    };
    const htmlBase = rc.params.htmlBase ?? '';
    const pathname = new URL(rc.params.url, 'file:').pathname;
    const Page = await getRoutePage(pathname);
    const page = new Page([import.meta]);
    // 初始化
    page.props = props;
    page.onCreated();
    // 在服务端请求数据
    await page.onServer();

    const script = await rc.script();
    await render.call(rc, page.imports);
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
