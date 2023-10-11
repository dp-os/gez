import path from 'path'
import { getProjectPath } from './project-path'
import { type NodeOptions } from './node'
import { Genesis } from './genesis'
import { createApp } from './app'

export function cli () {
  const file = getProjectPath(path.resolve(), 'dist/node/entry-node.mjs')
  import(/* @vite-ignore */file).then(async module => {
    const options: NodeOptions = module.default || {}
    if (typeof options.created !== 'function') {
      return
    }
    process.env.NODE_ENV = process.env.NODE_ENV ?? 'production'
    const genesis = new Genesis(options)
    genesis.app = await createApp(genesis)
    options.created(genesis)
  })
}
