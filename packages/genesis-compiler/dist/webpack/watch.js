"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watch = exports.WatchClientConfig = void 0;
const webpack_1 = __importDefault(require("webpack"));
const memory_fs_1 = __importDefault(require("memory-fs"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const webpack_2 = require("../webpack");
const utils_1 = require("../utils");
const install_1 = require("../plugins/install");
class WatchClientConfig extends webpack_2.ClientConfig {
    constructor(ssr) {
        super(ssr);
        this.config
            .entry('app')
            .add(`webpack-hot-middleware/client?path=${ssr.publicPath}webpack-hot-middleware&timeout=2000&overlay=false`);
        this.config
            .plugin('webpack-hot-replacement')
            .use(webpack_1.default.HotModuleReplacementPlugin);
    }
}
exports.WatchClientConfig = WatchClientConfig;
const readFile = (fs, file) => {
    try {
        return fs.readFileSync(file, 'utf-8');
    }
    catch (e) {
        return null;
    }
};
class Watch extends utils_1.BaseGenesis {
    constructor(ssr) {
        super(ssr);
        this.watchData = {};
        ssr.plugin.use(install_1.InstallPlugin);
    }
    get renderer() {
        if (!this._renderer) {
            throw TypeError(`Please execute 'await new Watch(ssr).start()'`);
        }
        return this._renderer;
    }
    set renderer(renderer) {
        this._renderer = renderer;
    }
    async start() {
        let ready;
        let clientDone = false;
        let serverDone = false;
        let promise = new Promise((resolve) => {
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
            new webpack_2.ServerConfig(this.ssr).toConfig()
        ]);
        const clientCompiler = webpack_1.default(clientConfig);
        const serverCompiler = webpack_1.default(serverConfig);
        serverCompiler.outputFileSystem = new memory_fs_1.default();
        this.devMiddleware = webpack_dev_middleware_1.default(clientCompiler, {
            publicPath: this.ssr.publicPath,
            stats: 'none',
            logLevel: 'error',
            index: false
        });
        this.hotMiddleware = webpack_hot_middleware_1.default(clientCompiler, {
            heartbeat: 5000,
            path: `${this.ssr.publicPath}webpack-hot-middleware`
        });
        const watchOptions = {
            aggregateTimeout: 300,
            poll: 1000
        };
        const clientOnDone = (stats) => {
            const jsonStats = stats.toJson();
            if (stats.hasErrors()) {
                jsonStats.errors.forEach((err) => console.error(err));
            }
            if (stats.hasWarnings()) {
                jsonStats.warnings.forEach((err) => console.warn(err));
            }
            if (stats.hasErrors())
                return;
            this.watchData.client = {
                fs: this.devMiddleware.fileSystem,
                data: JSON.parse(readFile(this.devMiddleware.fileSystem, this.ssr.outputClientManifestFile))
            };
            this.notify();
            clientDone = true;
            onReady();
        };
        const serverOnWatch = () => {
            const data = JSON.parse(readFile(serverCompiler.outputFileSystem, this.ssr.outputServerBundleFile));
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
    destroy() { }
    async notify() {
        const { client, server } = this.watchData;
        if (!client || !server)
            return;
        const { ssr } = this;
        if (this._renderer) {
            this._renderer.hotUpdate({ client, server });
        }
        else {
            this._renderer = new ssr.Renderer(ssr, { client, server });
        }
    }
}
exports.Watch = Watch;
