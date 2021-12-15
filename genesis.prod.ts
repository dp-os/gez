import express from 'express';

import { app, RendererItems, ssr, startApp } from './genesis';

const renderer: Partial<RendererItems> = {};

Object.keys(ssr).forEach((k) => {
    renderer[k] = ssr[k].createRenderer();
    // 设置静态目录和缓存
    app.use(
        renderer[k].staticPublicPath,
        express.static(renderer[k].staticDir, {
            immutable: true,
            maxAge: '31536000000'
        })
    );
});

startApp(renderer as RendererItems);
