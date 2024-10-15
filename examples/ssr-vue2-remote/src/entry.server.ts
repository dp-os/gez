import type { ServerContext } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

export default async (ctx: ServerContext, params: any) => {
    const files = await ctx.getImportmapFiles();

    const { app } = createApp();

    const html = await createRenderer({}).renderToString(app);
    ctx.html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gen Rspack</title>
</head>
<body>
    ${html}
${files
    .map((file) => {
        return `<script src="${file}"></script>`;
    })
    .join('\n')}
    <script defer>
((doc) => {
const importmap = doc.createElement('script');
importmap.type = 'importmap';
importmap.innerText = JSON.stringify(__importmap__)
doc.body.appendChild(importmap);
 })(document);
    </script>
    <script type="module">
    import "ssr-vue2-remote/entry";
    </script>
</body>
</html>
`;
};
