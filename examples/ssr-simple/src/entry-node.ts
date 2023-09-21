import { defineNode } from 'genesis3'

import express from 'express'

export default defineNode({
  created (genesis, app) {
    const server = express()
    server.use(genesis.base, app.middleware)

    server.get('*', async (req, res, next) => {
      try {
        const context = await app.render({ url: req.url })
        res.send(context.html)
      } catch (e) {
        next(e)
      }
    })
    server.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  }
})
