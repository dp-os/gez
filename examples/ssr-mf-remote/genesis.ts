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
        /**
         * 使用了MF，这个值必须设置为false
         */
        extractCSS: false
    }
});
/**
 * 创建MF实例
 */
export const mf = new MF(ssr, {
    exposes: {
        './src/vue-use': './src/vue-use.ts',
        './src/common-header.vue': './src/common-header.vue'
    },
    /**
     * 共享依赖
     */
    shared: {
        /**
         * 注意！！！
         * Vue需要设置单例，否则页面会出现异常
         */
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
    // host端传过来的编译时间
    const t = Number(req.query.t);
    // 最大等待时间
    const maxAwait = 1000 * 60;
    // 尝试等待manifest.json新的文件
    await mf.exposes.getManifest(t, maxAwait);
    // 继续往下执行，读取真实的静态资源文件
    next();
});

/**
 * 拿到渲染器后，启动应用程序
 */
export const startApp = (renderer: Renderer) => {
    /**
     * 请求进来，渲染html
     */
    app.get('*', async (req, res, next) => {
        try {
            const result = await renderer.renderHtml({
                req,
                res
            });
            res.send(result.data);
        } catch (e) {
            next(e);
        }
    });
    /**
     * 监听端口
     */
    app.listen(3002, () => console.log(`http://localhost:3002`));
};
