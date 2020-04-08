import { Watch } from '@fmfe/genesis-compiler';
import { ssr, RendererItems, app, startApp } from './genesis';

const start = async () => {
    const renderer: Partial<RendererItems> = {};
    const watchArr = await Promise.all(
        Object.keys(ssr).map(async (k) => {
            const watch = new Watch(ssr[k]);
            await watch.start();
            renderer[k] = watch.renderer;
            return watch;
        })
    );
    watchArr.forEach((watch) => {
        app.use(watch.devMiddleware);
        app.use(watch.hotMiddleware);
    });
    startApp(renderer as RendererItems);
};
start();
