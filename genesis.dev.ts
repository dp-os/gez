import express from 'express';
import { SSR } from '@fmfe/genesis-core';
import { Watch } from '@fmfe/genesis-compiler';

const start = async () => {
    const ssr = new SSR();
    const watch = new Watch(ssr);
    await watch.start();
    const renderer = watch.renderer;
    const app = express();

    app.use(watch.devMiddleware)
        .use(watch.hotMiddleware)
        .use(renderer.renderMiddleware);
    app.listen(3000, () => console.log(`http://localhost:3000`));
};

export default start();
