import { defineNode, createServer } from '@gez/core'

export default defineNode({
  name: 'ssr-qwik',
  async createDevApp (gez) {
    return await import('@gez/vite').then(async m => await m.createApp(gez))
  },
  created (gez) {
    const server = createServer(gez)
    server.listen(3004, () => {
      console.log('http://localhost:3004')
    })
  }
})
