import { defineServer } from '@gez/core'

export default defineServer({
  async render (context) {
    console.log('>>>>>>?');
    context.insertHtml(`<script type="module" src="/ssr-rspack-vue2/js/main.js"></script>`, 'bodyBefore')
  }
})


export function test () {
  return 'oik'
}