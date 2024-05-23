import { defineServer } from '@gem/core'
import ReactDOMServer from 'react-dom/server'

import { app } from './app'

export default defineServer({
  async render (context) {
    const html: string = await ReactDOMServer.renderToString(app)
    context.html = `<div id="app">${html}</div>`
  }
})
