import type { ServerContext } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

const renderer = createRenderer();

export default async (params: any, ctx: ServerContext) => {
    const script = await ctx.getInjectScript();

    const { app } = createApp();
    const vueCtx = {
        renderStyles: () => ''
    };
    const html = await renderer.renderToString(app, vueCtx);

    ctx.html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gez</title>
    ${vueCtx.renderStyles()}
</head>
<body>
    ${html}
    ${script}
</body>
</html>
`;
};
