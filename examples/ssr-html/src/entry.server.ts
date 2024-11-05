import type { RenderContext } from '@gez/core';
import { App } from './app';

export default async (rc: RenderContext) => {
    const state = {
        url: rc.params.url ?? '/'
    };
    const script = await rc.script();
    const app = new App({
        state
    });
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
        ${app.render()}
    </div>
    <script>
        window.__INIT_STATE__ = ${rc.serialize(state, { isJSON: true })}
    </script>
    ${script}
</body>
</html>
`;
};
