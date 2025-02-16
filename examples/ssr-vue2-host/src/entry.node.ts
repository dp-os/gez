import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    async createDevApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez)
        );
    },
    modules: {
        /**
         * 导入的模块基本配置
         */
        imports: {
            'ssr-vue2-remote': 'root:./node_modules/ssr-vue2-remote/dist'
        },
        /**
         * 外部依赖映射
         */
        externals: {
            vue: 'ssr-vue2-remote/npm/vue'
        }
    },
    async createServer(gez) {
        const server = express();
        server.use(gez.middleware);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({
                importmapMode: 'js',
                params: { url: req.url }
            });
            res.send(result.html);
        });
        server.listen(3004, () => {
            console.log('http://localhost:3004');
        });
    },
    async postCompileProdHook(gez) {
        const render = await gez.render({
            params: { url: '/' }
        });
        gez.writeSync(
            gez.resolvePath('dist/client', 'index.html'),
            render.html
        );
    }
} satisfies GezOptions;
