import { MF, Renderer, SSR } from '@fmfe/genesis-core';
import express from 'express';
import path from 'path';

/**
 * 创建一个应用程序
 */
export const app = express();

/**
 * 创建一个 SSR 实例
 */
export const ssr = new SSR({
    name: 'ssr-mf-host',
    build: {
        extractCSS: false,
        template: path.resolve('./index.html')
    }
});

export const mf = new MF(ssr, {
    shared: {
        vue: {
            singleton: true
        }
    },
    remotes: [
        {
            name: 'ssr-mf-remote',
            clientOrigin: 'http://localhost:3002',
            serverOrigin: 'http://localhost:3002'
        }
    ]
});

/**
 * 拿到渲染器后，启动应用程序
 */
export const startApp = (renderer: Renderer) => {
    /**
     * 初始化远程模块
     */
    mf.remote.init(renderer);
    /**
     * 轮询远程模块
     */
    mf.remote.polling();
    /**
     * 请求进来，渲染html
     */
    app.get('*', async (req, res, next) => {
        try {
            const result = await renderer.renderHtml({ req, res });
            res.send(result.data);
        } catch (e) {
            next(e);
        }
    });
    /**
     * 监听端口
     */
    app.listen(3001, () => console.log(`http://localhost:3001`));
};
