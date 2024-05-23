import { defineNode, createServer } from '@gez/core'

export default defineNode({
  name: 'ssr-react',
  async createDevApp (gez) {
    return await import('@gez/vite').then(async m => await m.createApp(gez))
  },
  created (gez) {
    const server = createServer(gez)
    server.listen(3003, () => {
      console.log('http://localhost:3003')
    })
  }
})
