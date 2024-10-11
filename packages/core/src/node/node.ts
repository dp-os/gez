import http, { type IncomingMessage, type ServerResponse } from 'node:http';

import type { Gez, GezOptions } from '../core';

export interface NodeOptions extends GezOptions {
    created: (gez: Gez) => void;
}

export function defineNode(options: NodeOptions) {
    return options;
}
/**
 * Create a simple HTTP server, I suggest you replace it with Express
 */
export function createServer(gez: Gez) {
    const render = async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const context = await gez.render({
                url: req.url ?? '/'
            });
            res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.end(context.html);
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.end('500 Internal Server Error');
        }
    };
    return http.createServer((req, res) => {
        gez.middleware(req, res, () => {
            render(req, res);
        });
    });
}
