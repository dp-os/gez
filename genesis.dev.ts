import { Watch } from '@fmfe/genesis-compiler';
import { Plugin, PostcssOptions } from '@fmfe/genesis-core';
import tailwindcss from 'tailwindcss';

import { app, RendererItems, ssr, startApp } from './genesis';
export class PostcssPlugin extends Plugin {
    public postcss(config: PostcssOptions) {
        config.postcssOptions.plugins.push(tailwindcss);
    }
}

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
