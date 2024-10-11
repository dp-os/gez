import { execSync } from 'node:child_process';
import { defineNode } from '@gez/core';
import express from 'express';

export default defineNode({
    name: 'ssr-rspack-vue2_remote',
    async createDevApp(gez) {
        return import('@gez/rspack-vue2').then((m) => m.createApp(gez));
    },
    async created(gez) {
        const server = express();
        /**
         * 允许跨域
         * 只有允许跨域才可以在其他服务获取到 remote(远程服务) 的数据
         */
        server.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE, OPTIONS'
            );
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            next();
        });
        server.use(gez.middleware);
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({ url: '/' });
            res.send(result.html);
        });
        execSync(
            'npx vue-tsc --declaration --emitDeclarationOnly --noEmit false --outDir types/src'
        );
        server.listen(3003, () => {
            console.log('http://localhost:3003');
        });
    },
    modules: {
        /**
         * 导出的文件
         */
        exports: ['./src/utils/index.ts', 'vue']
    }
});
