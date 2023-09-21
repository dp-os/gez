import { defineNode, createServer } from 'genesis3'

export default defineNode({
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3001, () => {
      console.log('http://localhost:3001')
    })
  }
})
