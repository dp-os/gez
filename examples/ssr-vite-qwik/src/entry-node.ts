import { defineNode, createServer } from '@gem/core'

export default defineNode({
  name: 'ssr-qwik',
  async createDevApp (genesis) {
    return await import('@gem/vite').then(async m => await m.createApp(genesis))
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3004, () => {
      console.log('http://localhost:3004')
    })
  }
})
