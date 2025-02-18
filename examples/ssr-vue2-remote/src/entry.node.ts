import type { GezOptions } from '@gez/core';
import express from 'express';

export default {
    async devApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez)
        );
    },
    async server(gez) {
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
            // 导出 Vue 实例，确保 Host 和 Remote 使用相同版本
            'npm:vue',
            // UI 组件
            'root:src/components/index.ts',
            // 组合式函数
            'root:src/composables/index.ts',
            // 示例组件
            'root:src/examples/index.ts'
        ]
    },
    async postBuild(gez) {
        const render = await gez.render({
            params: { url: '/' }
        });
        gez.writeSync(
            gez.resolvePath('dist/client', 'index.html'),
            render.html
        );
    }
} satisfies GezOptions;
