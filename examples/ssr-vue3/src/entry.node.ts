import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    name: 'ssr-vue3',
    modules: {
        exports: ['npm:vue']
    },
    async createDevApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createApp(gez, () => {
                return {
                    vue: 3
                };
            })
        );
    },
    async createServer(gez) {
        const server = express();
        server.use(gez.middleware);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({ url: '/' });
            res.send(result.html);
        });
        server.listen(3100, () => {
            console.log('http://localhost:3100');
        });
    }
} satisfies GezOptions;
