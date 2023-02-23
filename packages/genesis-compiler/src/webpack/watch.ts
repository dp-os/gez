import { Renderer, SSR } from '@fmfe/genesis-core';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import Webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';

import { InstallPlugin } from '../plugins/install';
import { BaseGenesis } from '../utils';
import { ClientConfig, ServerConfig } from '../webpack';

export class WatchClientConfig extends ClientConfig {
    public constructor(ssr: SSR) {
        super(ssr);
        this.config
            .entry('app')
            .add(`webpack-hot-middleware/client?path=${ssr.publicPath}hot-middleware&timeout=2000&overlay=false`);
        this.config.plugin('webpack-hot-replacement').use(Webpack.HotModuleReplacementPlugin);
    }
}

export class Watch extends BaseGenesis {
    public devMiddleware: any;
    public hotMiddleware: any;
    private _renderer: Renderer | null;

    public constructor(ssr: SSR) {
        super(ssr);
        ssr.plugin.unshift(InstallPlugin);
    }

    public get renderer() {
        if (!this._renderer) {
            throw TypeError(`Please execute 'await new Watch(ssr).start()'`);
        }
        return this._renderer;
    }

    public set renderer(renderer: Renderer) {
        this._renderer = renderer;
    }

    public async start() {
        let ready: Function | null;
        let clientDone = false;
        let serverDone = false;
        let promise: Promise<void> | null = new Promise<void>((resolve) => {
            ready = resolve;
        });
        const onReady = () => {
            if (clientDone && serverDone) {
                ready && ready();
                promise = null;
                ready = null;
            }
        };
        await this.ssr.plugin.callHook('beforeCompiler', 'watch');
        const [clientConfig, serverConfig] = await Promise.all([
            new WatchClientConfig(this.ssr).toConfig(),
            new ServerConfig(this.ssr).toConfig()
        ]);
        const clientCompiler = Webpack(clientConfig);
        const serverCompiler = Webpack(serverConfig);
        this.devMiddleware = WebpackDevMiddleware(clientCompiler, {
            publicPath: this.ssr.publicPath,
            index: false,
            outputFileSystem: {
                ...fs,
                join: path.join.bind(path),
                // @ts-ignore
                mkdirp: mkdirp.bind(mkdirp)
            }
        });
        this.hotMiddleware = WebpackHotMiddleware(clientCompiler, {
            heartbeat: 5000,
            path: `${this.ssr.publicPath}hot-middleware`
        });
        const watchOptions = {
            aggregateTimeout: 300,
            poll: 1000
        };
        const clientOnDone = (stats: Webpack.Stats) => {
            if (stats.hasErrors()) return;
            this.notify();
            clientDone = true;
            onReady();
        };
        const serverOnWatch = () => {
            this.notify(true);
            serverDone = true;
            onReady();
        };
        clientCompiler.hooks.done.tap('build done', clientOnDone);
        serverCompiler.watch(watchOptions, serverOnWatch);
        return promise;
    }

    // 这里应该提供销毁实例的方法
    public destroy() {}

    private async notify(isServer = false) {
        const { ssr } = this;
        if (!fs.existsSync(ssr.outputClientManifestFile) || !fs.existsSync(ssr.outputServeAppFile)) {
            return;
        }
        if (this._renderer && isServer) {
            this._renderer.reload();
        } else if (!this._renderer) {
            this._renderer = ssr.createRenderer();
        }
        await this.ssr.plugin.callHook('afterCompiler', 'watch');
    }
}
