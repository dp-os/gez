import { defineServer } from '@gez/core'
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

export default defineServer({
  async render(context) {
    const { app } = createApp()

    const html = await createRenderer({}).renderToString(app)
    context.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gen for Rspack</title>
    </head>
    <body>
    ${html}
    <script src="/ssr-rspack-vue2/importmap.js"></script>
    <script defer>
    document.body.appendChild(Object.assign(document.createElement('script'), {
      type: 'importmap',
      innerHTML: JSON.stringify(__importmap__),
    }));
    </script>
    <script type="module">
    import "ssr-rspack-vue2/entry-client";
    </script>
    </body>
    </html>
`
    // context.insertHtml(`<script type="module" src="ssr-rspack-vue2/entry-client"></script>`, 'bodyBefore')
  }
})
