import { defineNode } from '@gez/core';
import express from 'express';

export default defineNode({
    name: 'ssr-rspack-vue2-host',
    async createDevApp(gez) {
        return import('@gez/rspack-vue2').then((m) => m.createApp(gez));
    },
    async created(gez) {
        const server = express();
        server.use(...gez.middlewares);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({ url: '/' });
            res.send(result.html);
        });
        server.listen(3002, () => {
            console.log('http://localhost:3002');
        });
    },
    modules: {
        imports: {
            // 'ssr-rspack-vue2-remote': 'root:../ssr-rspack-vue2-remote/dist'
            'ssr-rspack-vue2-remote': [
                'root:../../.root/ssr-rspack-vue2-remote',
                'http://127.0.0.1:8080'
            ]
        },
        externals: {
            vue: 'ssr-rspack-vue2-remote/npm/vue'
        }
    }
});
