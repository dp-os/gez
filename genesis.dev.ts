import { Watch } from '@fmfe/genesis-compiler';

import { app, RendererItems, ssr, startApp } from './genesis';
import { PostcssPlugin } from './genesis.plugin';

ssr.layout.plugin.use(PostcssPlugin);

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
