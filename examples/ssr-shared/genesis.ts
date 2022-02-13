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
    name: 'ssr-shared',
    build: {
        extractCSS: false,
        template: path.resolve('./index.html')
    }
});

export const mf = new MF(ssr, {
    exposes: {
        './vue-use': 'vue-use.ts'
    },
    shared: {
        vue: {
            singleton: true
        },
        'vue-router': {
            singleton: true
        },
        'element-ui': {
            singleton: true
        }
    }
});

/**
 * 拿到渲染器后，启动应用程序
 */
export const startApp = (renderer: Renderer) => {
    /**
     * 使用默认渲染中间件进行渲染，你也可以调用更加底层的 renderer.renderJson 和 renderer.renderHtml 来实现渲染
     */
    app.use(renderer.renderMiddleware);
    /**
     * 监听端口
     */
    app.listen(3004, () => console.log(`http://localhost:3004`));
};
