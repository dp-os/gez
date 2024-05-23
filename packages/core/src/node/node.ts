import http, { type IncomingMessage, type ServerResponse } from 'http'

import { type Gez, type GezOptions } from '../core'

export interface NodeOptions extends GezOptions {
  created: (gez: Gez) => void
}

export function defineNode (options: NodeOptions) {
  return options
}
/**
 * Create a simple HTTP server, I suggest you replace it with Express
 */
export function createServer (gez: Gez) {
  const render = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const context = await gez.render({
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
    if (typeof url === 'string' && url.startsWith(gez.base)) {
      req.url = url.substring(gez.base.length - 1)
      gez.middleware(req, res, (err?: Error) => {
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
