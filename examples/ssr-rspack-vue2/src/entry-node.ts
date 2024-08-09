import express from 'express'
import { defineNode } from '@gez/core'

export default defineNode({
  name: 'ssr-rspack-vue2',
  async createDevApp(gez) {
    const { createApp } = await import('@gez/rspack')
    const { vue2Config } = await import('@gez/rspack-vue2');
    return createApp(gez, vue2Config)
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
