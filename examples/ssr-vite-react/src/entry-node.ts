import { defineNode, createServer } from '@gez/core'

export default defineNode({
  name: 'ssr-react',
  async createDevApp (genesis) {
    return await import('@gez/vite').then(async m => await m.createApp(genesis))
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3003, () => {
      console.log('http://localhost:3003')
    })
  }
})
