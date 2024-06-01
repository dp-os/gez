import { defineServer } from '@gez/core'

export default defineServer({
  async render (context) {
    context.html = `<h2>你好，世界22222222！</h2>`
    context.insertHtml(`<script type="module" src="/ssr-rspack-vue2/js/main.js"></script>`, 'bodyBefore')
  }
})