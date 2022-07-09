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
        },
        'vue-router': {
            singleton: true
        },
        'vue-meta': {
            singleton: true
        }
    },
    exposes: {
        './src/common/create-app-client': 'src/common/create-app-client.ts',
        './src/common/create-app': 'src/common/create-app.ts'
    },
    remotes: [
        {
            /**
             * 服务名称
             */
            name: 'ssr-mf-about',
            /**
             * 客户端的远程模块下载源，程序会自动拼接：http://localhost:3002/[name]/node-exposes/[filename]
             */
            clientOrigin: 'http://localhost:3002',
            /**
             * 支持下列方式获取远程模块，例如：
             *      http://localhost:3002
             *      /Volumes/work/github/fmfe/genesis
             * 程序会判断字符串中是否包含[name]和[filename]，如果没有包含，则会拼接：/[name]/node-exposes/[filename]
             * 实际会变成：
             *      http://localhost:3002/[name]/node-exposes/[filename]
             *      /Volumes/work/github/fmfe/genesis/[name]/node-exposes/[filename]
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
