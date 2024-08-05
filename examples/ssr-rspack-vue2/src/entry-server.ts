import { defineServer } from '@gez/core'
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

export default defineServer({
  async render(context) {
    const { app } = createApp()
    const html = await createRenderer({}).renderToString(app)
    const title = await import('./text').then(m => m.getTitle())
    context.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
    ${html}
    </body>
    </html>
`
    context.insertHtml(`<script type="module" src="/ssr-rspack-vue2/js/app.js"></script>`, 'bodyBefore')
  }
})