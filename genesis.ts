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
    app.get('/about/', renderer.home.renderMiddleware);
    app.get('/error/', renderer.home.renderMiddleware);
    app.get('/api/remote/about/', (req, res, next) => {
        const url = req.query.renderUrl;
        if (typeof url !== 'string') {
            return res.status(404).end();
        }
        renderer.about
            .renderJson({ req, res, url })
            .then((r) => res.send(r.data))
            .catch(next);
    });
    app.get('/api/remote/common-header/', (req, res, next) => {
        const url = req.query.renderUrl;
        if (typeof url !== 'string') {
            return res.status(404).end();
        }
        renderer.remote
            .renderJson({ req, res, url })
            .then((r) => res.send(r.data))
            .catch(next);
    });

    app.listen(3000, () => console.log(`http://localhost:3000`));
};
