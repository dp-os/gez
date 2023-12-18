import { createServer } from 'vite'
import { ViteNodeServer } from 'vite-node/server'
import { ViteNodeRunner } from 'vite-node/client'
import { installSourcemapsSupport } from 'vite-node/source-map'

const file = (process.argv.slice(2)[0] ?? '').trim()

export async function nodeRunner (cb: (module: Record<string, any>) => Promise<void>) {
  const server = await createServer({
    optimizeDeps: {
      disabled: true
    }
  })
  await server.pluginContainer.buildStart({})

  const node = new ViteNodeServer(server)

  installSourcemapsSupport({
    getSourceMap: source => node.getSourceMap(source)
  })

  const runner = new ViteNodeRunner({
    root: server.config.root,
    base: server.config.base,
    async fetchModule (id) {
      return await node.fetchModule(id)
    },
    async resolveId (id, importer) {
      return await node.resolveId(id, importer)
    }
  })
  const module = await runner.executeFile(file.endsWith('.ts') ? file : 'src/entry-node.ts')
  await cb(module)
  await server.close()
}
