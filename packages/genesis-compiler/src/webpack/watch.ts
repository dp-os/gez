import Webpack from 'webpack';
import MFS from 'memory-fs';
import chalk from 'chalk';
import { SSR, Renderer } from '@fmfe/genesis-core';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import { ClientConfig, ServerConfig } from '../webpack';
import { BaseGenesis } from '../utils';
import { InstallPlugin } from '../plugins/install';
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

// Ignore discard warning
(process as any).noDeprecation = true;

export class WatchClientConfig extends ClientConfig {
    public constructor(ssr: SSR) {
        super(ssr);
        this.config
            .entry('app')
            .add(
                `webpack-hot-middleware/client?path=${ssr.publicPath}webpack-hot-middleware&timeout=2000&overlay=false`
            );
        this.config
            .plugin('webpack-hot-replacement')
            .use(Webpack.HotModuleReplacementPlugin);
    }
}
const readFile = (fs, file) => {
    try {
        return fs.readFileSync(file, 'utf-8');
    } catch (e) {
        return null;
    }
};

interface WatchSubData {
    client: { data: any; fs: any };
    server: { data: any; fs: any };
}
export class Watch extends BaseGenesis {
    public devMiddleware: any;
    public hotMiddleware: any;
    public mfs = new MFS();
    private watchData: Partial<WatchSubData> = {};
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
        let ready: Function;
        let clientDone = false;
        let serverDone = false;
        let promise = new Promise<void>((resolve) => {
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
        serverCompiler.outputFileSystem = this.mfs;
        clientCompiler.outputFileSystem = this.mfs;
        this.devMiddleware = WebpackDevMiddleware(clientCompiler, {
            outputFileSystem: this.mfs,
            publicPath: this.ssr.publicPath,
            index: false
        });
        this.hotMiddleware = WebpackHotMiddleware(clientCompiler, {
            heartbeat: 5000,
            path: `${this.ssr.publicPath}webpack-hot-middleware`
        });
        const watchOptions = {
            aggregateTimeout: 300,
            poll: 1000
        };
        const clientOnDone = (stats: Webpack.Stats) => {
            const jsonStats = stats.toJson();
            if (stats.hasErrors()) {
                jsonStats.errors.forEach((err) =>
                    console.log(error(err.message))
                );
            }
            if (stats.hasWarnings()) {
                jsonStats.warnings.forEach((err) =>
                    console.log(warning(err.message))
                );
            }
            if (stats.hasErrors()) return;
            this.watchData.client = {
                fs: this.mfs,
                data: JSON.parse(
                    readFile(this.mfs, this.ssr.outputClientManifestFile)
                )
            };
            this.notify();
            clientDone = true;
            onReady();
        };
        const serverOnWatch = () => {
            const data = JSON.parse(
                readFile(
                    serverCompiler.outputFileSystem,
                    this.ssr.outputServerBundleFile
                )
            );
            this.watchData.server = {
                fs: serverCompiler.outputFileSystem,
                data
            };
            this.notify();
            serverDone = true;
            onReady();
        };
        clientCompiler.hooks.done.tap('build done', clientOnDone);
        serverCompiler.watch(watchOptions, serverOnWatch);
        return promise.then(async () => {
            await this.ssr.plugin.callHook('afterCompiler', 'watch');
        });
    }

    // 这里应该提供销毁实例的方法
    public destroy() {}

    private async notify() {
        const { client, server } = this.watchData;
        if (!client || !server) return;
        const { ssr } = this;
        if (this._renderer) {
            this._renderer.hotUpdate({ client, server });
        } else {
            this._renderer = new ssr.Renderer(ssr, { client, server });
        }
    }
}
