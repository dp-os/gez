import { defineNode, createServer } from 'genesis3'

export default defineNode({
  name: 'ssr-qwik',
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3004, () => {
      console.log('http://localhost:3004')
    })
  }
})
