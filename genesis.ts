import express from 'express';
import path from 'path';
import { SSR, Renderer } from '@fmfe/genesis-core';

export const app = express();

class SSRItems {
    public home = new SSR({
        name: 'ssr-home',
        build: {
            baseDir: path.resolve(__dirname, './examples/ssr-home')
        }
    });

    public remote = new SSR({
        name: 'ssr-remote',
        build: {
            baseDir: path.resolve(__dirname, './examples/ssr-remote')
        }
    });

    public about = new SSR({
        name: 'ssr-about',
        build: {
            baseDir: path.resolve(__dirname, './examples/ssr-about')
        }
    });
}

export type RendererItems = Record<keyof SSRItems, Renderer>;

export const ssr = new SSRItems();

export const startApp = (renderer: RendererItems) => {
    app.get('/', renderer.home.renderMiddleware);
    app.get('/about/', (req, res, next) => {
        renderer.about
            .renderJson(req, res)
            .then((r) => res.send(r.data))
            .catch(next);
    });
    app.get('/api/remote/common-header/', (req, res, next) => {
        renderer.remote
            .renderJson(req, res)
            .then((r) => res.send(r.data))
            .catch(next);
    });

    app.listen(3000, () => console.log(`http://localhost:3000`));
};
