import express from 'express';
import { SSR, Renderer } from '@fmfe/genesis-core';

export const app = express();

export const ssr = new SSR();

export const startApp = (renderer: Renderer) => {
    app.use(renderer.renderMiddleware);
    app.listen(3000, () => console.log(`http://localhost:3000`));
};
