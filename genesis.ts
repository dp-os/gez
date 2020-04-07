import express from 'express';
import path from 'path';
import { SSR, Renderer } from '@fmfe/genesis-core';

export const app = express();

export const ssr = new SSR({
    build: {
        baseDir: path.resolve(__dirname, './examples/ssr-base')
    }
});

export const startApp = (renderer: Renderer) => {
    app.use(renderer.renderMiddleware);
    app.listen(3000, () => console.log(`http://localhost:3000`));
};
