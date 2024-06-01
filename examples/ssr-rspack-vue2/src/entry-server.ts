import { defineServer } from '@gez/core'

export default defineServer({
  async render (context) {
    context.html = `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
    <div id="app"></div>
    </body>
    </html>
`
    context.insertHtml(`<script src="/ssr-rspack-vue2/js/app.js" defer></script>`, 'bodyBefore')
  }
})