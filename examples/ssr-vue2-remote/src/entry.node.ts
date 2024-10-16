import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    name: 'ssr-vue2-remote',
    async createDevApp(gez) {
        return import('@gez/rspack-vue2').then((m) => m.createApp(gez));
    },
    async createServer(gez) {
        const server = express();
        server.use(...gez.middlewares);
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
        exports: ['root:src/utils/index.ts', 'npm:vue']
    }
} satisfies GezOptions;
