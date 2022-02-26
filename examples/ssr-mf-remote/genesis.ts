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
    name: 'ssr-mf-remote',
    build: {
        extractCSS: false,
        template: path.resolve('./index.html')
    }
});

export const mf = new MF(ssr, {
    exposes: {
        './src/vue-use': './src/vue-use.ts',
        './src/common-header.vue': './src/common-header.vue'
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
    },
    /**
     * 读取本地生成的类型文件，生成给其它的远程模块调用，如果没有，可以使用 vue-tsc --declaration --emitDeclarationOnly 来生成
     */
    typesDir: path.resolve('./types')
});

/**
 * 重写 manifest.json 的响应逻辑，注意要在静态服务的请求之前添加处理函数
 * 如果1分钟内有更新，则立即往下执行，响应请求
 * 如果1分钟内没有更新，则再结束请求，避免对方太频繁轮询
 */
app.get(mf.manifestRoutePath, async (req, res, next) => {
    await mf.exposes.getManifest(Number(req.query.t), 10000);
    //  继续往下执行，读取真实的静态资源文件
    next();
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
    app.listen(3002, () => console.log(`http://localhost:3002`));
};