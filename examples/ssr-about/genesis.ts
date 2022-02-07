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
    name: 'ssr-about',
    build: {
        extractCSS: false,
        baseDir: path.resolve(__dirname)
    }
});

export const mf = new MF(ssr, {
    exposes: {
        './router': 'router.ts'
    }
});

/**
 * 拿到渲染器后，启动应用程序
 */
export const startApp = (renderer: Renderer) => {
    const { exposes } = mf;
    app.get('/api/eventsource/exposes', (req, res) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        // 监听导出的内容变化，发送数据
        const unWatch = exposes.watch((data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        });
        // 监听请求关闭，取消监听
        res.on('close', () => {
            unWatch();
            res.end();
        });
    });

    /**
     * 使用默认渲染中间件进行渲染，你也可以调用更加底层的 renderer.renderJson 和 renderer.renderHtml 来实现渲染
     */
    app.use(renderer.renderMiddleware);
    /**
     * 监听端口
     */
    app.listen(3002, () => console.log(`http://localhost:3002`));
};
