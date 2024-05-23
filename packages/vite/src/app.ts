import { type Genesis, type App, type AppRenderParams, type ProjectPath, ServerContext, type ServerRender } from '@gem/core'
import { createServer, type InlineConfig } from 'vite'
import { mergeViteConfig } from './vite-config'
import { build } from './build'

export async function createApp (genesis: Genesis): Promise<App> {
  const viteConfig: InlineConfig = mergeViteConfig(genesis, {
    server: { middlewareMode: true },
    appType: 'custom'
  })
  const vite = await createServer(viteConfig)
  return {
    middleware: vite.middlewares,
    async build () {
      await build(genesis)
    },
    async render (params: AppRenderParams): Promise<ServerContext> {
      try {
        const module = await vite.ssrLoadModule(genesis.getProjectPath('src/entry-server.ts'))
        const render: ServerRender | undefined = module.default
        const context = new ServerContext(genesis, params)
        if (typeof render === 'function') {
          await render(context)
          const src: ProjectPath = 'src/entry-client.ts'
          const insertHtml = '<script type="module" src="/' + String(src) + '"></script>'
          context.insertHtml(insertHtml, 'headBefore')
          context.html = await vite.transformIndexHtml(context.params.url, context.html)
        }

        return context
      } catch (e) {
        if (e instanceof Error) {
          vite.ssrFixStacktrace(e)
        }
        throw e
      }
    },
    async destroy () {
      vite.close()
    }
  }
}
