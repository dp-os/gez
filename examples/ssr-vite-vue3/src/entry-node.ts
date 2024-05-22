import { defineNode, createServer } from 'genesis3'

export default defineNode({
  name: 'ssr-vue3',
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3002, () => {
      console.log('http://localhost:3002')
    })
  }
})
