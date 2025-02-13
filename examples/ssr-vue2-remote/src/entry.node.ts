import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    async createDevApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez)
        );
    },
    async createServer(gez) {
        const server = express();
        server.use(gez.middleware);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({
                params: { url: '/' }
            });
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
        exports: [
            // Vue 实例
            'npm:vue',
            // UI 组件统一导出
            'root:src/components/index.ts',
            // 组合式函数统一导出
            'root:src/composables/index.ts'
        ]
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
