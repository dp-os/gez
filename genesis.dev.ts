import { Watch } from '@fmfe/genesis-compiler';
import { ssr, app, startApp } from './genesis';

const start = async () => {
    const watch = new Watch(ssr);
    await watch.start();
    const renderer = watch.renderer;
    // 开发时使用的中间件
    app.use(watch.devMiddleware);
    app.use(watch.hotMiddleware);
    // 拿到渲染器之后，启动服务
    startApp(renderer);
};
start();
