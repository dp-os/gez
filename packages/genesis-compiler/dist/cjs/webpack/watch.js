"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watch = exports.WatchClientConfig = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const install_1 = require("../plugins/install");
const utils_1 = require("../utils");
const webpack_2 = require("../webpack");
const error = chalk_1.default.bold.red;
const warning = chalk_1.default.keyword('orange');
class WatchClientConfig extends webpack_2.ClientConfig {
    constructor(ssr) {
        super(ssr);
        this.config
            .entry('app')
            .add(`webpack-hot-middleware/client?path=${ssr.publicPath}hot-middleware&timeout=2000&overlay=false`);
        this.config
            .plugin('webpack-hot-replacement')
            .use(webpack_1.default.HotModuleReplacementPlugin);
    }
}
exports.WatchClientConfig = WatchClientConfig;
class Watch extends utils_1.BaseGenesis {
    constructor(ssr) {
        super(ssr);
        ssr.plugin.unshift(install_1.InstallPlugin);
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
        const clientCompiler = (0, webpack_1.default)(clientConfig);
        const serverCompiler = (0, webpack_1.default)(serverConfig);
        this.devMiddleware = (0, webpack_dev_middleware_1.default)(clientCompiler, {
            publicPath: this.ssr.publicPath,
            writeToDisk: true,
            index: false
        });
        this.hotMiddleware = (0, webpack_hot_middleware_1.default)(clientCompiler, {
            heartbeat: 5000,
            path: `${this.ssr.publicPath}hot-middleware`
        });
        const watchOptions = {
            aggregateTimeout: 300,
            poll: 1000
        };
        const clientOnDone = (stats) => {
            const jsonStats = stats.toJson();
            if (stats.hasErrors()) {
                jsonStats.errors.forEach((err) => console.log(error(err.message)));
            }
            if (stats.hasWarnings()) {
                jsonStats.warnings.forEach((err) => console.log(warning(err.message)));
            }
            if (stats.hasErrors())
                return;
            this.notify();
            clientDone = true;
            onReady();
        };
        const serverOnWatch = () => {
            this.notify();
            serverDone = true;
            onReady();
        };
        clientCompiler.hooks.done.tap('build done', clientOnDone);
        serverCompiler.watch(watchOptions, serverOnWatch);
        return promise;
    }
    // 这里应该提供销毁实例的方法
    destroy() { }
    async notify() {
        const { ssr } = this;
        if (!fs_1.default.existsSync(ssr.outputClientManifestFile) ||
            !fs_1.default.existsSync(ssr.outputServeAppFile)) {
            return;
        }
        if (this._renderer) {
            this._renderer.reload();
        }
        else {
            this._renderer = new ssr.Renderer(ssr);
        }
        await this.ssr.plugin.callHook('afterCompiler', 'watch');
    }
}
exports.Watch = Watch;
