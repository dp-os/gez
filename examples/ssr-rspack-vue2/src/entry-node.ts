import express from 'express'
import { defineNode } from '@gez/core'
import { execSync } from 'node:child_process';

import { importmapConfig } from './entry-importmap';

export default defineNode({
    name: 'ssr-rspack-vue2',
    async createDevApp(gez) {
        return import('@gez/rspack-vue2').then(m => m.createApp(gez))
    },
    async created(gez) {
        const server = express()
        server.use(gez.middleware)
        server.get('*', async (req, res) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            const result = await gez.render({ url: '/' })
            res.send(result.html)
        })
        execSync('npx --yes vue-tsc --declaration --emitDeclarationOnly');
        server.listen(3002, () => {
            console.log('http://localhost:3002')
        })
    },
    modules: {
        /**
         * 类型生成的目录
         */
        typeDir: './types',
        /**
         * 导出的文件
         */
        exposes: importmapConfig.exposes,
        /**
         * 导入的文件
         * ssr-name/vue
         * ssr-name/src/config
         */
        imports: importmapConfig.imports,
        /**
         * 导入的文件的前置路径
         * *符号为兜底逻辑
         * 例子：
         * ssr-remote: 192.168.0.0.1:3001
         * ssr-common: 192.168.0.0.1:3002
         * *: 192.168.0.0.1
         */
        importBase: {
            'ssr-rspack-vue2_remote': 'http://localhost:3003'
        }
    }
})
