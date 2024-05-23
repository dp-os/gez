import path from 'path'
import { getProjectPath } from '../core/project-path'
import { type NodeOptions } from '../node'
import { Genesis, createApp } from '../core'

export function cli () {
  const file = getProjectPath(path.resolve(), 'dist/node/entry-node.js')
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
