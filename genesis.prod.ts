import express from 'express';
import { ssr, app, startApp } from './genesis';

const renderer = ssr.createRenderer();

// 设置静态目录和缓存
app.use(
    renderer.staticPublicPath,
    express.static(renderer.staticDir, {
        immutable: true,
        maxAge: '31536000000'
    })
);

startApp(renderer);
