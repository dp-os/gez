import http from 'node:http';
import path from 'node:path';
import type { GezOptions } from '@gez/core';
import { name } from '../package.json';

export default {
    // 设置应用的唯一名字，如果有多个项目，则名字不能重复
    name,
    // 本地执行 dev 和 build 时会使用
    async createDevApp(gez) {
        // 这里应使用动态模块。生产依赖不存在。
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
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
                const render = await gez.render({
                    params: {
                        url: req.url
                    }
                });
                // 响应 HTML 内容
                res.end(render.html);
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
            const render = await gez.render({
                base: '/gez',
                params: { url: url, htmlBase: `/gez/${name}` }
            });
            gez.writeSync(
                path.resolve(
                    gez.getProjectPath('dist/client'),
                    url.substring(1),
                    'index.html'
                ),
                render.html
            );
        }
    }
} satisfies GezOptions;
