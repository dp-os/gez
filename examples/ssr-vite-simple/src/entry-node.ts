import { defineNode, createServer } from 'genesis3'

export default defineNode({
  name: 'ssr-simple',
  async createDevApp (genesis) {
    return await import('genesis-vite').then(async m => await m.createApp(genesis))
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  }
})
