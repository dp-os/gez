import type { ServerContext } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';

import { log } from 'ssr-rspack-vue2-remote/src/utils/index';
import { createApp } from './create-app';

export default async (ctx: ServerContext, params: any) => {
    console.log('@entry-server', params);

    const importMapConfig = ctx.getImportmapConfig();
    log('ssr-rspack-vue2-host');

    const { app } = createApp();

    const html = await createRenderer({}).renderToString(app);

    return (ctx.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gen for Rspack</title>
      <script async src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js"></script>
      <!-- https://generator.jspm.io/#U2NhYGBkDM0rySzJSU1hKEpNTC5xMLTQM9Az0C1K1jMAAKFS5w0gAA -->
    </head>
    <body>

    <script defer>

    ((global) => {
        const importsMap = ${JSON.stringify(importMapConfig.map)};
        const importmapKey = '__importmap__';
        const importmap = global[importmapKey] = global[importmapKey] || {};
        const imports = importmap.imports = importmap.imports || {};
        Object.assign(imports, importsMap);
    })(globalThis);

    </script>

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
`);
};
