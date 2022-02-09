import { MF, Renderer, SSR } from '@fmfe/genesis-core';
import express from 'express';
import path from 'path';

import { shared } from '../shared/mf';

/**
 * 创建一个应用程序
 */
export const app = express();

/**
 * 创建一个 SSR 实例
 */
export const ssr = new SSR({
    name: 'ssr-hub',
    build: {
        template: path.resolve(__dirname, '../shared/index.html'),
        extractCSS: false,
        baseDir: path.resolve(__dirname),
        transpile: [/examples\/shared/]
    }
});

export const mf = new MF(ssr, {
    remotes: [
        {
            name: 'ssr-home',
            publicPath: 'http://localhost:3001',
            serverUrl: 'http://localhost:3001/api/eventsource/exposes'
        },
        {
            name: 'ssr-about',
            publicPath: 'http://localhost:3002',
            serverUrl: 'http://localhost:3002/api/eventsource/exposes'
        }
    ],
    shared
});

/**
 * 拿到渲染器后，启动应用程序
 */
export const startApp = async (renderer: Renderer) => {
    /**
     * 需要把渲染器传递进去，这样远程服务更新的时候，会自动调用运行最新代码
     */
    mf.remote.init(renderer);
    /**
     * 使用默认渲染中间件进行渲染，你也可以调用更加底层的 renderer.renderJson 和 renderer.renderHtml 来实现渲染
     */
    app.use(async (req, res, next) => {
        const now = Date.now();
        const data = await renderer.renderHtml({
            req,
            res,
            styleTagExtractCSS: true
        });
        console.log(`render ${req.url} ${Date.now() - now}ms`);
        res.send(data.data);
    });
    /**
     * 监听端口
     */
    app.listen(3000, () => console.log(`http://localhost:3000`));
};
