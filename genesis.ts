import express from 'express';
import path from 'path';
import { SSR, Renderer } from '@fmfe/genesis-core';

export const app = express();

class SSRItems {
    public layout = new SSR({
        name: 'ssr-layout',
        build: {
            baseDir: path.resolve(__dirname, './examples/ssr-layout')
        }
    });

    public home = new SSR({
        name: 'ssr-home',
        build: {
            baseDir: path.resolve(__dirname, './examples/ssr-home')
        },
        cdnPublicPath: 'https://cdn.followme-acceleration.com'
    });

    public about = new SSR({
        name: 'ssr-about',
        build: {
            baseDir: path.resolve(__dirname, './examples/ssr-about')
        }
    });

    public genesis = new SSR({
        build: {
            outputDir: path.resolve(
                __dirname,
                './packages/genesis-core/dist/ssr-genesis'
            )
        }
    });
}

export type RendererItems = Record<keyof SSRItems, Renderer>;

export const ssr = new SSRItems();

export const startApp = (renderer: RendererItems) => {
    /**
     * 渲染基本的页面布局
     */
    const layout: express.RequestHandler = async (req, res, next) => {
        renderer.layout
            .renderHtml({ req, res })
            .then((result) => {
                res.send(result.data);
            })
            .catch(next);
    };
    app.get('/', layout);
    app.get('/about', layout);

    /**
     * 首页
     */
    app.get('/api/home', (req, res, next) => {
        const url = String(req.query.renderUrl) || '/';
        renderer.home
            .renderJson({ url, req, res })
            .then((result) => {
                res.send(result.data);
            })
            .catch(next);
    });
    /**
     * 关于我们
     */
    app.get('/api/about', (req, res, next) => {
        const url = String(req.query.renderUrl) || '/';
        renderer.about
            .renderJson({ url, req, res })
            .then((result) => {
                res.send(result.data);
            })
            .catch(next);
    });
    app.listen(3000, () => console.log(`http://localhost:3000`));
};
