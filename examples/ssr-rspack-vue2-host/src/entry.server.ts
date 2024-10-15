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
    document.body.appendChild(Object.assign(document.createElement('script'), {
      type: 'importmap',
      innerText: JSON.stringify(__importmap__),
    }));
    </script>
    <script type="module">
    import "ssr-rspack-vue2-host/entry";
    </script>
</body>
</html>
`;
};
