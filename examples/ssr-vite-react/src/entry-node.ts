import { defineNode, createServer } from '@gem/core'

export default defineNode({
  name: 'ssr-react',
  async createDevApp (genesis) {
    return await import('@gem/vite').then(async m => await m.createApp(genesis))
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3003, () => {
      console.log('http://localhost:3003')
    })
  }
})
