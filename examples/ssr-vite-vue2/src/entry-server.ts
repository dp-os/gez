import { defineServer } from '@gem/core'
import { createRenderer } from 'vue-server-renderer'
import { createApp } from './main'

const renderer = createRenderer()

export default defineServer({
  async render (context) {
    const { app, state } = createApp()

    const html: string = await renderer.renderToString(app, context)
    context.html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<div id="app">${html}</div><template id="state">${JSON.stringify(state)}</template>    
</body>
</html>
`
  }
})
