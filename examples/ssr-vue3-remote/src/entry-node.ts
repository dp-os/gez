import { defineNode, createServer } from 'genesis3'

export default defineNode({
  name: 'ssr-vue3-remote',
  federation: {
    exposes: ['src/common-button.vue']
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3003, () => {
      console.log('http://localhost:3003')
    })
  }
})
