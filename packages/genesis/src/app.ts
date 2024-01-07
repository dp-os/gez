import { type IncomingMessage, type ServerResponse, type IncomingHttpHeaders } from 'node:http'
import serveStatic from 'serve-static'
import { type Genesis } from './genesis'
import { ServerContext, type ServerRender } from './server-context'

export interface AppParams {
  url: string
  timeout?: number
  headers?: IncomingHttpHeaders
  extra?: Record<string, any>
}

export type AppMiddlewareNext = Function

export interface App {
  middleware: (req: IncomingMessage, res: ServerResponse, next?: AppMiddlewareNext) => void
  render: (params: AppParams) => Promise<ServerContext>
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
    async render (params: AppParams) {
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
