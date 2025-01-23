import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    packs: {
        enable: true
    },
    // 本地执行 dev 和 build 时会使用
    async createDevApp(gez) {
        // 这里应使用动态模块。生产依赖不存在。
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                minimize: false,
                config(context) {
                    // 可以在这里修改 Rspack 编译的配置
                    // 自定义你的 Vue、React等框架的打包逻辑
                }
            })
        );
    },
    async createServer(gez) {
        const server = http.createServer((req, res) => {
            // 静态文件处理
            gez.middleware(req, res, async () => {
                // 传入渲染的参数
                const rc = await gez.render({
                    params: {
                        url: req.url
                    }
                });
                // 响应 HTML 内容
                res.end(rc.html);
            });
        });
        // 监听端口
        server.listen(3000, () => {
            console.log('http://localhost:3000');
        });
    },
    async postCompileProdHook(gez) {
        const list: string[] = ['/', '/about'];
        for (const url of list) {
            const rc = await gez.render({
                params: { url: url, htmlBase: `/gez/${gez.name}` }
            });
            gez.writeSync(
                gez.resolvePath('dist/client', url.substring(1), 'index.html'),
                rc.html
            );
        }
    },
    modules: {
        exports: ['root:src/title/index.ts']
    }
} satisfies GezOptions;
