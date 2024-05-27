import { defineNode, createServer } from '@gez/core'

export default defineNode({
  name: 'ssr-rspack-vue2',
  async createDevApp (gez) {
    return import('@gez/rspack-vue2').then(async m => await m.createApp(gez))
  },
  created (gez) {
    const server = createServer(gez)
    server.listen(3002, () => {
      console.log('http://localhost:3002')
    })
  }
})
