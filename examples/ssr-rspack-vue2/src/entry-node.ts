import express from 'express'
import { defineNode } from '@gez/core'

export default defineNode({
  name: 'ssr-rspack-vue2',
  async createDevApp(gez) {
    return import('./ssr').then(async m => await m.createApp(gez))
  },
  async created(gez) {
    const server = express()
    server.use(gez.middleware)
    server.get('*', async (req, res) => {
      res.setHeader('Content-Type', 'text/html;charset=UTF-8');
      const result = await gez.render({ url: '/' })
      res.send(result.html)
    })
    server.listen(3002, () => {
      console.log('http://localhost:3002')
    })
  }
})
