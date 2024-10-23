import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    name: 'ssr-base',
    async createDevApp(gez) {
        return import('@gez/rspack').then((m) => m.createApp(gez));
    },
    async createServer(gez) {
        const server = express();
        server.use(gez.middleware);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({ url: req.url });
            res.send(result.html);
        });
        server.listen(3002, () => {
            console.log('http://localhost:3002');
        });
    }
} satisfies GezOptions;
