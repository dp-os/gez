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
    name: 'ssr-mf-home',
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
        }
    },
    exposes: {
        './src/common/client': 'src/common/client.ts',
        './src/common/common': 'src/common/common.ts'
    },
    remotes: [
        {
            /**
             * 服务名称
             */
            name: 'ssr-mf-about',
            /**
             * 客户端的远程模块下载源，程序会自动拼接：http://localhost:3002/[服务名称]/node-exposes/[文件名]
             */
            clientOrigin: 'http://localhost:3002',
            /**
             * 服务端的远程模块下载源，程序会自动拼接：http://localhost:3002/[服务名称]/node-exposes/[文件名]
             */
            serverOrigin: 'http://localhost:3002'
        }
    ],
    /**
     * 读取本地生成的类型文件，生成给其它的远程模块调用
     */
    typesDir: path.resolve('./types/ssr-mf-about')
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
     * 轮询远程模块
     */
    mf.remote.polling();
    /**
     * 请求进来，渲染html
     */
    app.get('/', async (req, res, next) => {
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
    app.listen(3001, () => console.log(`http://localhost:3001`));
};
