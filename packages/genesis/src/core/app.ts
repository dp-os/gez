import { type IncomingMessage, type ServerResponse, type IncomingHttpHeaders } from 'node:http'
import serveStatic from 'serve-static'
import { type Genesis } from './genesis'
import { ServerContext, type ServerRender } from '../server/server-context'

export interface AppRenderParams {
  url: string
  timeout?: number
  headers?: IncomingHttpHeaders
  extra?: Record<string, any>
}

export interface App {
  middleware: (req: IncomingMessage, res: ServerResponse, next?: Function) => void
  render: (params: AppRenderParams) => Promise<ServerContext>
  build: () => Promise<void>
  destroy: () => Promise<void>
}

export async function createApp (genesis: Genesis): Promise<App> {
  const root = genesis.getProjectPath('dist/client')
  return {
    middleware: serveStatic(root, {
      setHeaders (res) {
        res.setHeader('cache-control', 'public, max-age=31536000')
      }
    }) as App['middleware'],
    async render (params: AppRenderParams) {
      const context = new ServerContext(genesis, params)
      const result = await import(/* @vite-ignore */genesis.getProjectPath('dist/server/entry-server.js'))
      const serverRender: ServerRender = result.default
      if (typeof serverRender === 'function') {
        await serverRender(context)
      }

      return context
    },
    async build () {
    },
    async destroy () {}
  }
}
