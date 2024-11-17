import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    async createDevApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue3App(gez)
        );
    },
    async createServer(gez) {
        const server = express();
        server.use(gez.middleware);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({
                params: {
                    url: '/'
                }
            });
            res.send(result.html);
        });
        server.listen(3004, () => {
            console.log('http://localhost:3004');
        });
    },
    async postCompileProdHook(gez) {
        const render = await gez.render({
            base: '/gez',
            params: { url: '/' }
        });
        gez.writeSync(
            gez.resolvePath('dist/client', 'index.html'),
            render.html
        );
    }
} satisfies GezOptions;
