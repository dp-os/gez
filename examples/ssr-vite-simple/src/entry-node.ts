import { defineNode, createServer } from '@gez/core'

export default defineNode({
  name: 'ssr-simple',
  async createDevApp (gez) {
    return await import('@gez/vite').then(async m => m.createApp(gez))
  },
  created (gez) {
    const server = createServer(gez)
    server.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  }
})
