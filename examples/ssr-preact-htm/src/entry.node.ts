import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    // 本地执行 dev 和 build 时会使用
    async devApp(gez) {
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
    async server(gez) {
        const server = http.server((req, res) => {
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
        server.listen(3001, () => {
            console.log('http://localhost:3001');
        });
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
