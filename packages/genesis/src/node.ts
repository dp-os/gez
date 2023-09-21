import http, { type IncomingMessage, type ServerResponse } from 'http'

import { type Genesis, type GenesisOptions } from './genesis'
import { type App } from './app'

export interface NodeOptions extends GenesisOptions {
  created: (genesis: Genesis, app: App) => void
}

export function defineNode (options: NodeOptions) {
  return options
}
/**
 * Create a simple HTTP server, I suggest you replace it with Express
 */
export function createServer (genesis: Genesis, app: App) {
  const render = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const context = await app.render({
        url: req.url ?? '/'
      })
      res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' })
      res.end(context.html)
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/html;charset=UTF-8' })
      res.end('500 Internal Server Error')
    }
  }
  return http.createServer((req, res) => {
    const url = req.url
    if (typeof url === 'string' && url.indexOf(genesis.base) === 0) {
      req.url = url.substring(genesis.base.length - 1)
      app.middleware(req, res, (err?: Error) => {
        if (err instanceof Error) {
          console.error(err)
        }
        req.url = url
        render(req, res)
      })
    } else {
      render(req, res)
    }
  })
}
