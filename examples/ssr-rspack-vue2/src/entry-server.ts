import { defineServer } from '@gez/core'

export default defineServer({
  async render (context) {
    console.log('>>>>>>>>???');
    context.html = 'ok'
  }
})
