import { defineNode, createServer } from '@gez/core'

export default defineNode({
  name: 'ssr-vue3',
  async createDevApp (genesis) {
    return await import('@gez/vite').then(async m => await m.createApp(genesis))
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3002, () => {
      console.log('http://localhost:3002')
    })
  }
})
