#!/usr/bin/env node
import { Genesis, createApp as createProdApp, type NodeOptions } from 'genesis3'
import { nodeRunner } from './node-runner'
import { createApp as createDevApp } from './app'
const type = process.argv.slice(2)[0]

export function cli () {
  nodeRunner(async (module) => {
    const options: NodeOptions = module.default || {}
    const { created } = options
    if (typeof created !== 'function') {
      return
    }
    const genesis = new Genesis(options)
    switch (type) {
      case 'dev':
        genesis.app = await createDevApp(genesis)
        created(genesis)
        break
      case 'build':
        await build(genesis)
        break
      case 'start':
        genesis.app = await createProdApp(genesis)
        created(genesis)
        break
    }
  })
}

async function build (genesis: Genesis) {
  process.env.NODE_ENV = 'production'
  const bridge = await createDevApp(genesis)
  await bridge.build()
  await bridge.destroy()
}
