import { defineNode } from '@gez/core';
import express from 'express';

export default defineNode({
    name: 'ssr-rspack-vue2',
    async createDevApp(gez) {
        return import('@gez/rspack-vue2').then((m) => m.createApp(gez));
    },
    async created(gez) {
        const server = express();
        server.use(gez.middleware);
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
        exports: ['root:src/utils/index.ts', 'npm:vue'],
        imports: {
            'ssr-rspack-vue2-remote': 'root:../ssr-rspack-vue2-remote/dist'
        },
        externals: {
            vue: 'ssr-rspack-vue2-remote/npm/vue'
        }
    }
});
