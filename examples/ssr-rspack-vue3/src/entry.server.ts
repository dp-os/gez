import { defineServer } from '@gez/core';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './create-app';

export default defineServer({
    async render(context) {
        const { app } = createApp();

        const html = await renderToString(app);
        context.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gen for Rspack</title>
    </head>
    <body>
    ${html}
    <script src="/ssr-vue3/importmap.js"></script>
    <script defer>
    document.body.appendChild(Object.assign(document.createElement('script'), {
      type: 'importmap',
      innerHTML: JSON.stringify(__importmap__),
    }));
    </script>
    <script type="module">
    import "ssr-vue3/entry-client";
    </script>
    </body>
    </html>
`;
    }
});
