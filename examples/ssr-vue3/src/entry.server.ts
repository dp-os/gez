import type { RenderContext } from '@gez/core';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './create-app';

export default async (rc: RenderContext) => {
    const { app } = createApp('server');
    const context = {
        imports: []
    };
    const html = await renderToString(app, context);
    await rc.bind(context.imports);
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
    ${html}
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>
`;
};
