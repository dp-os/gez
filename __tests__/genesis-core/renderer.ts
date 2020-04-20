/* eslint-disable no-undef */
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { SSR } from '../../packages/genesis-core/src/ssr';
import { Plugin } from '../../packages/genesis-core/src/plugin';

class Home extends SSR {
    public constructor() {
        super({
            name: 'ssr-home',
            build: {
                baseDir: path.resolve(__dirname, '../../examples/ssr-home')
            }
        });
    }
}
class About extends SSR {
    public constructor() {
        super({
            name: 'ssr-about',
            build: {
                baseDir: path.resolve(__dirname, '../../examples/ssr-about')
            }
        });
    }
}

const ssr = {
    home: new Home(),
    about: new About()
};

test('renderer.ssr ', async () => {
    const renderer = ssr.home.createRenderer();
    await expect(renderer.ssr).toBe(ssr.home);
});

test('renderer.staticDir', async () => {
    const renderer = ssr.home.createRenderer();
    await expect(renderer.staticDir).toBe(ssr.home.outputDirInClient);
});

test('renderer.staticPublicPath', async () => {
    const renderer = ssr.home.createRenderer();
    await expect(renderer.staticPublicPath).toBe(ssr.home.publicPath);
});

test('renderer.render default html', async () => {
    const renderer = ssr.about.createRenderer();

    // Defalut
    const result = await renderer.render();
    await expect(result.type).toBe('html');
    await expect(typeof result.data).toBe('string');
    await expect(result.context.data.name).toBe(ssr.about.name);
    await expect(result.context.data.url).toBe('/');
    await expect(result.context.data.automount).toBeTruthy();
    await expect(result.context.mode).toBe('ssr-html');
});
test('renderer.render', async () => {
    const renderer = ssr.home.createRenderer();

    // Defalut
    let result = await renderer.render();
    await expect(result.type).toBe('html');
    await expect(typeof result.data).toBe('string');
    await expect(result.context.data.name).toBe(ssr.home.name);
    await expect(result.context.data.url).toBe('/');
    await expect(result.context.data.automount).toBeTruthy();
    await expect(result.context.mode).toBe('ssr-html');

    // options.(url | req | res)
    const req = new IncomingMessage(new Socket());
    const res = new ServerResponse(req);

    result = await renderer.render({ url: '/test' });
    await expect(result.context.data.url).toBe('/test');

    result = await renderer.render({ req, res });
    await expect(result.context.data.url).toBe('');
    await expect(result.context.req).toBe(req);
    await expect(result.context.res).toBe(res);

    req.url = '/test2';
    result = await renderer.render({ req, res });
    await expect(result.context.data.url).toBe('/test2');
    await expect(result.context.req).toBe(req);
    await expect(result.context.res).toBe(res);

    req.url = '/test2';
    result = await renderer.render({ req, res, url: '/test3' });
    await expect(result.context.data.url).toBe('/test3');
    await expect(result.context.req).toBe(req);
    await expect(result.context.res).toBe(res);

    req.url = undefined;
    result = await renderer.render({ req, res, url: '/' });
    await expect(result.context.data.url).toBe('/');
    await expect(result.context.req).toBe(req);
    await expect(result.context.res).toBe(res);

    // options.mode
    result = await renderer.render({ mode: 'ssr-html' });
    await expect(result.context.mode).toBe('ssr-html');
    await expect(result.data).not.toBe(result.context.data.html);
    await expect(result.data).toBe(result.context.renderHtml());

    result = await renderer.render({ mode: 'csr-html' });
    await expect(result.context.mode).toBe('csr-html');
    await expect(result.context.data.html).toBe(
        '<div data-ssr-genesis-id="8d07b00bc6ec949da008e624ef609b3d"></div>'
    );
    await expect(result.data).not.toBe(result.context.data.html);
    await expect(result.data).toBe(result.context.renderHtml());

    result = await renderer.render({ mode: 'ssr-json' });
    await expect(result.context.mode).toBe('ssr-json');
    await expect(result.context.data).toBe(result.data);

    result = await renderer.render({ mode: 'csr-json' });
    await expect(result.context.mode).toBe('csr-json');
    await expect(result.context.data).toBe(result.data);
    await expect(result.context.data.html).toBe(
        '<div data-ssr-genesis-id="8d07b00bc6ec949da008e624ef609b3d"></div>'
    );

    result = await renderer.render({ mode: 'ssr-test' as any });
    await expect(result.context.mode).toBe('ssr-html');

    // options.id
    result = await renderer.render({ id: '100000000' });
    await expect(result.context.data.id).toBe('100000000');

    // options.name
    result = await renderer.render({ name: 'ssr-ok' });
    await expect(result.context.data.name).toBe('ssr-ok');

    // options.automount
    result = await renderer.render({ automount: false });
    await expect(result.context.data.automount).toBeFalsy();

    // options.state
    const state = {};
    result = await renderer.render({ state });
    await expect(result.context.data.state).toBe(state);
});

test('renderer.renderHtml', async () => {
    const renderer = ssr.home.createRenderer();
    let result = await renderer.renderHtml();
    await expect(result.context.renderHtml()).toBe(result.data);
    await expect(result.context.mode).toBe('ssr-html');

    result = await renderer.renderHtml({ mode: 'csr-html' });
    await expect(result.context.renderHtml()).toBe(result.data);
    await expect(result.data).toBe(result.data);
    await expect(result.context.mode).toBe('csr-html');
    await expect(result.context.data.html).toBe(
        '<div data-ssr-genesis-id="8d07b00bc6ec949da008e624ef609b3d"></div>'
    );

    result = await renderer.renderHtml({ url: '/' });
    await expect(result.context.mode).toBe('ssr-html');
});

test('renderer.renderJson', async () => {
    const renderer = ssr.home.createRenderer();

    let result = await renderer.renderJson();
    await expect(result.context.mode).toBe('ssr-json');
    await expect(result.context.data).toBe(result.data);

    result = await renderer.renderJson({ mode: 'csr-json' });
    await expect(result.context.mode).toBe('csr-json');
    await expect(result.context.data).toBe(result.data);
    await expect(result.context.data.html).toBe(
        '<div data-ssr-genesis-id="8d07b00bc6ec949da008e624ef609b3d"></div>'
    );

    result = await renderer.renderJson({ url: '/' });
    await expect(result.context.mode).toBe('ssr-json');
});

test('renderer.hotUpdate', async () => {
    const renderer = ssr.home.createRenderer();
    await expect(() => renderer.hotUpdate()).not.toThrowError();
});

test('renderer.renderMiddleware', async () => {
    const ssr = new Home();
    const renderer = ssr.createRenderer();

    // html
    let req = new IncomingMessage(new Socket());
    let res = new ServerResponse(req);
    await new Promise((resolve) => {
        (res as any).end = resolve;
        renderer.renderMiddleware(req, res, () => {});
    });

    await expect(res.getHeader('content-type')).toBe(
        'text/html; charset=utf-8'
    );
    await expect(res.getHeader('cache-control')).toBe('max-age=0');

    // json
    req = new IncomingMessage(new Socket());
    res = new ServerResponse(req);
    class MyPlugin extends Plugin {
        public renderBefore(context) {
            context.mode = 'ssr-json';
        }
    }
    ssr.plugin.use(MyPlugin);
    await new Promise((resolve) => {
        (res as any).end = resolve;
        renderer.renderMiddleware(req, res, () => {});
    });

    await expect(res.getHeader('content-type')).toBe(
        'application/json; charset=utf-8'
    );
    await expect(res.getHeader('cache-control')).toBe('max-age=0');
    // error
    req = new IncomingMessage(new Socket());
    res = new ServerResponse(req);
    const warn = console.warn;
    const error = console.error;
    console.warn = () => {};
    console.error = () => {};
    req.url = '/error';
    await renderer.renderMiddleware(req, res, (err) => {
        expect(err.toString().trim()).toBe('TypeError: jest test error');
    });
    console.warn = warn;
    console.error = error;
});

test('renderer callHook', async () => {
    const ssr = new Home();
    let renderBefore = 0;
    let renderCompleted = 0;
    let context;
    class MyPlugin extends Plugin {
        public renderBefore(ctx) {
            renderBefore++;
            context = ctx;
        }

        public async renderCompleted(ctx) {
            renderCompleted++;
            await expect(context).toBe(ctx);
        }
    }
    ssr.plugin.use(MyPlugin);
    const renderer = ssr.createRenderer();

    let result = await renderer.render({ url: '/test' });
    await expect(renderBefore).toBe(1);
    await expect(renderCompleted).toBe(1);
    await expect(context).toBe(result.context);

    result = await renderer.renderHtml({ url: '/test' });
    await expect(renderBefore).toBe(2);
    await expect(renderCompleted).toBe(2);
    await expect(context).toBe(result.context);

    result = await renderer.renderJson({ url: '/test' });
    await expect(renderBefore).toBe(3);
    await expect(renderCompleted).toBe(3);
    await expect(context).toBe(result.context);
});
