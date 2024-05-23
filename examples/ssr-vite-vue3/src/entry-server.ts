import { defineServer } from '@gem/core'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export default defineServer({
  async render (context) {
    const { app, state } = createApp()

    const html: string = await renderToString(app, context)

    context.html = `${html}<template id="state">${JSON.stringify(state)}</template>`
  }
})
