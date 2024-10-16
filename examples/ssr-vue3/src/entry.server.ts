import type { ServerContext } from '@gez/core';
import { renderToString } from 'vue/server-renderer';

import { createApp } from './create-app';

export default async (ctx: ServerContext, params: any) => {
    const { app } = createApp('server');
    const files = await ctx.getImportmapFiles();
    const body = await renderToString(app, {});
    ctx.html = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gen Rspack</title>
  </head>
  <body>
      ${body}
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
      import "ssr-vue3/entry";
      </script>
  </body>
  </html>
  `;
};
