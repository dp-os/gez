import { defineNode, createServer } from '@gez/core'

export default defineNode({
  name: 'ssr-simple',
  async createDevApp (genesis) {
    return await import('@gez/vite').then(async m => m.createApp(genesis))
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  }
})
