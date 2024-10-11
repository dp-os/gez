import { defineServer } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

// import path from 'node:path'
// import fs from 'node:fs'

export default defineServer({
    async render(context) {
        const { app } = createApp();

        const html = await createRenderer({}).renderToString(app);

        context.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gen for Rspack</title>
      <script async src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js"></script>
      <!-- https://generator.jspm.io/#U2NhYGBkDM0rySzJSU1hKEpNTC5xMLTQM9Az0C1K1jMAAKFS5w0gAA -->
    </head>
    <body>
    <script src="/ssr-rspack-vue2_remote/importmap.js"></script>
    <script defer>
    document.body.appendChild(Object.assign(document.createElement('script'), {
      type: 'importmap',
      innerHTML: JSON.stringify(__importmap__),
    }));
    </script>

    <script type="module">
    // import {log} from 'ssr-rspack-vue2/src/utils/index.ts';
    // log('test')
    </script>
    ${html}

    <script type="module">
    import "ssr-rspack-vue2_remote/entry-client";
    </script>
    </body>
    </html>
`;
        // context.insertHtml(`<script type="module" src="ssr-rspack-vue2_remote/entry-client"></script>`, 'bodyBefore')
    }
});
