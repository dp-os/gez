import type { ServerContext } from '@gez/core';
import { renderToString } from 'vue/server-renderer';

import { createApp } from './create-app';

export default async (ctx: ServerContext, params: any) => {
    const { app } = createApp('server');
    const script = await ctx.getInjectScript();
    const body = await renderToString(app, {});
    ctx.html = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gez</title>
  </head>
  <body>
      ${body}
      ${script}
  </body>
  </html>
  `;
};
