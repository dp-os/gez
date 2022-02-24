const { SSR, Renderer } = require('@fmfe/genesis-core');
const express = require('express');

/**
 * 创建一个SSR的实例
 */
const ssr = new SSR({
    /**
     * 设置一个服务的名称
     */
    name: 'ssr-demo'
});
/**
 * 创建服务器
 */
const app = express();

/**
 * 程序启动
 * @param {Renderer} renderer
 */
function startApp(renderer) {
    /**
     * 监听请求，执行渲染程序
     */
    app.get('*', async (req, res, next) => {
        const result = await renderer.renderHtml({ req, res });
        res.send(result.data);
    });
    /**
     * 监听3000端口
     */
    app.listen(3000, () => console.log(`http://localhost:3000`));
}

exports.ssr = ssr;
exports.app = app;
exports.startApp = startApp;
