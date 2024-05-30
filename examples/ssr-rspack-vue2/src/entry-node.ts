import express from 'express'
import { defineNode } from '@gez/core'

export default defineNode({
  name: 'ssr-rspack-vue2',
  async createDevApp(gez) {
    return import('@gez/rspack-vue2').then(async m => await m.createApp(gez))
  },
  async created(gez) {
    const server = express()
    server.use(gez.app.middleware)
    server.get('*', async (req, res) => {
      const result = await gez.app.render({ url: '/' })
      res.send(result.html)
    })
    server.listen(3002, () => {
      console.log('http://localhost:3002')
    })
  }
})
