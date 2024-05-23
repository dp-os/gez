import { defineNode, createServer } from '@gem/core'

export default defineNode({
  name: 'ssr-vue2',
  async createDevApp (genesis) {
    return await import('@gem/vite').then(async m => await m.createApp(genesis))
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3002, () => {
      console.log('http://localhost:3002')
    })
  }
})
