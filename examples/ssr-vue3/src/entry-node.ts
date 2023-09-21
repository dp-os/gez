import { defineNode, createServer } from 'genesis3'

export default defineNode({
  created (genesis, app) {
    const server = createServer(genesis, app)
    server.listen(3001, () => {
      console.log('http://localhost:3001')
    })
  }
})
