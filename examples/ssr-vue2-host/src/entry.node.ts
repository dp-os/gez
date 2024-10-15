import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    name: 'ssr-vue2-host',
    async createDevApp(gez) {
        return import('@gez/rspack-vue2').then((m) => m.createApp(gez));
    },
    async createServer(gez) {
        const server = express();
        server.use(...gez.middlewares);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({ url: req.url });
            res.send(result.html);
        });
        server.listen(3002, () => {
            console.log('http://localhost:3002');
        });
    },
    modules: {
        imports: {
            // 'ssr-vue2-remote': 'root:../ssr-vue2-remote/dist',
            'ssr-vue2-remote': [
                'root:../../.root/ssr-vue2-remote',
                'http://localhost:3003/ssr-vue2-remote/versions/latest.json'
            ]
        },
        externals: {
            vue: 'ssr-vue2-remote/npm/vue'
        }
    }
} satisfies GezOptions;
