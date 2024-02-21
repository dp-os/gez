import { defineNode } from 'genesis3'
import express from 'express'

export default defineNode({
  name: 'ssr-vue3-remote',
  federation: {
    exposes: ['src/common-button.vue', 'src/utils.ts']
  },
  created (genesis) {
    const server = express()
    server.use(genesis.base, genesis.middleware)
    server.get('*', async (req, res, next) => {
      try {
        const context = await genesis.render({ url: req.url })
        res.send(context.html)
      } catch (e) {
        next(e)
      }
    })
    server.listen(3003, () => {
      console.log('http://localhost:3003')
    })
  }
})
