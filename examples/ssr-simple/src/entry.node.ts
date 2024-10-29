import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    name: 'ssr-simple',
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) => m.createApp(gez));
    },
    async createServer(gez) {
        const server = http.createServer((req, res) => {
            gez.middleware(req, res, async () => {
                const ctx = await gez.render({
                    url: req.url
                });
                res.end(ctx.html);
            });
        });
        server.listen(3005, () => {
            console.log('http://localhost:3005');
        });
    }
} satisfies GezOptions;