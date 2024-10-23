import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    name: 'ssr-vue2-remote',
    async createDevApp(gez) {
        return import('@gez/rspack-vue').then((m) => m.createVue2App(gez));
    },
    async createServer(gez) {
        const server = express();
        server.use(gez.middleware);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({ url: '/' });
            res.send(result.html);
        });
        server.listen(3003, () => {
            console.log('http://localhost:3003');
        });
    },
    modules: {
        /**
         * 导出的文件
         */
        exports: ['root:src/components/layout.vue', 'npm:vue']
    }
} satisfies GezOptions;
