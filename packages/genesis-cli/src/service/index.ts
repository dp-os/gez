import CustomSSR from '../bean/CustomSSR';
import express, { Express, NextFunction, Request, Response } from 'express';
import type { Service, ServiceOptions } from '../../types';
import { createExpress } from './express';
import { serveStaticOptions } from '../config/serveStaticOptions';
import { Watch } from '@fmfe/genesis-compiler';
import { Renderer, RenderMode, RenderOptions } from '@fmfe/genesis-core';
import httpProxy, { ProxyTarget } from 'http-proxy';

/**
 * create Service
 * @param options genesis config
 */
export async function createService(options: ServiceOptions): Promise<Express> {
    const app = await createExpress(options.port, false);

    const ssr = CustomSSR.createInstanceByServiceOptions(options);

    let proxyService: Service[] = Array.isArray(options.proxyService)
        ? options.proxyService || []
        : [options.proxyService] as Service[];

    let renderInstance: Renderer;
    let watch: Watch;

    if (options.isProd) {
        proxyService = [];
        renderInstance = ssr.createRenderer();
        app.use(
            renderInstance.staticPublicPath,
            express.static(renderInstance.staticDir, serveStaticOptions)
        );
    } else {
        watch = new Watch(ssr);
        await watch.start();
        renderInstance = watch.renderer;
        app.use(watch.devMiddleware);
        app.use(watch.hotMiddleware);
    }

    if (options.api) {
        app.use(options.api, (req: Request, res: Response, next: NextFunction) => {
            renderInstance
                .render(getDefaultRenderOptions(req))
                .then(renderResult => {
                    res.send(renderResult.data);
                })
                .catch((e) => {
                    next(e);
                });
        });
    }

    proxyService.forEach(service => {
        const httpProxyInstance = httpProxy.createProxyServer({});
        app.use(service.api, (req, res) => {
            // TODO use node url model
            req.url = service.api + req.url
            httpProxyInstance.web(
                req,
                res,
                {
                    target: service as ProxyTarget,
                    changeOrigin: true
                },
                (err) => {
                    res.status(500).send(err.message);
                }
            );
        });
    });

    app.use(renderInstance.renderMiddleware);

    return app;
}

export function getDefaultRenderOptions(req: Request): RenderOptions {
    const modes: RenderMode[] = ['ssr-html', 'ssr-json', 'csr-html', 'csr-json'];
    // 获取渲染的地址
    const url = decodeURIComponent(String(req.query.renderUrl || ''));
    // 获取路由渲染的模式
    const routerMode =
        ['abstract', 'history'].indexOf(String(req.query.routerMode)) > -1
            ? req.query.routerMode
            : 'history';
    const renderMode = String(req.query.renderMode) as RenderMode;
    // 渲染默认
    const mode: RenderMode = modes.includes(renderMode)
        ? renderMode as RenderMode
        : 'ssr-json';
    // Genesis.RenderOptions
    return {
        url,
        mode,
        state: {
            routerMode
        }
    };
}
