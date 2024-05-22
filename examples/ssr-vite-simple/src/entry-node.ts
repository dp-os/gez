import { defineNode, createServer } from 'genesis3'

export default defineNode({
  name: 'ssr-simple',
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  }
})
