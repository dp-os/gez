import { defineNode } from '@gez/core';
import express from 'express';

export default defineNode({
    name: 'ssr-rspack-vue3',
    async createDevApp(gez) {
        return import('@gez/rspack-vue3').then((m) => m.createApp(gez));
    },
    async created(gez) {
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
});
