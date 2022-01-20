"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSR = void 0;
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const plugin_1 = require("./plugin");
const renderer_1 = require("./renderer");
class SSR {
    /**
     * Constructor
     */
    constructor(options = {}) {
        /**
         * Renderer
         */
        this.Renderer = renderer_1.Renderer;
        this.options = options;
        this.plugin = new plugin_1.PluginManage(this);
        if ('name' in options && typeof options.name !== 'string') {
            throw new TypeError('Options.name can only be of string type');
        }
    }
    /**
     * Judge whether it is a production environment. By default, judge by process.env.NODE_ENV
     */
    get isProd() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.isProd) || process_1.default.env.NODE_ENV === 'production';
    }
    /**
     * Current app name, default is 'ssr-genesis'
     */
    get name() {
        return this.options.name || 'ssr-genesis';
    }
    /**
     * The basic path of client static resource loading, which is '/ssr-genesis/' by default
     */
    get publicPath() {
        var _a, _b;
        return ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.publicPath) || `/${this.name}/`;
    }
    /**
     * CDN resource public path, Only valid in production mode
     */
    get cdnPublicPath() {
        var _a;
        if (!this.isProd)
            return '';
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.cdnPublicPath) || '';
    }
    /**
     * Project root
     */
    get baseDir() {
        var _a, _b;
        return ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.baseDir) || path_1.default.resolve();
    }
    /**
     * Compiled output directory
     */
    get outputDir() {
        var _a, _b;
        if ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.outputDir) {
            if (path_1.default.isAbsolute(this.options.build.outputDir)) {
                return this.options.build.outputDir;
            }
            return path_1.default.resolve(this.baseDir, this.options.build.outputDir);
        }
        return path_1.default.resolve(this.baseDir, `./dist/${this.name}`);
    }
    /**
     * Client compile output directory
     */
    get outputDirInClient() {
        return path_1.default.resolve(this.outputDir, './client');
    }
    /**
     * Server compile output directory
     */
    get outputDirInServer() {
        return path_1.default.resolve(this.outputDir, './server');
    }
    /**
     * Static file directory
     */
    get staticDir() {
        return path_1.default.resolve(this.outputDir, './client');
    }
    /**
     * Compile source entry directory
     */
    get srcDir() {
        return path_1.default.resolve(this.baseDir, './src');
    }
    /**
     * Directory to be compiled by webpack
     */
    get srcIncludes() {
        return [
            ...this.transpile,
            this.srcDir,
            path_1.default.resolve(this.outputDir, './src')
        ];
    }
    get transpile() {
        var _a, _b;
        return ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.transpile) || [];
    }
    /**
     * Client side compile entry file
     */
    get entryClientFile() {
        return path_1.default.resolve(this.outputDir, 'src/entry-client');
    }
    /**
     * Server side compile entry file
     */
    get entryServerFile() {
        return path_1.default.resolve(this.outputDir, 'src/entry-server');
    }
    /**
     * Manifest file path of client
     */
    get outputClientManifestFile() {
        return path_1.default.resolve(this.outputDirInServer, 'vue-ssr-client-manifest.json');
    }
    /**
     * Manifest file path of server
     */
    get outputServerBundleFile() {
        return path_1.default.resolve(this.outputDirInServer, 'app.js');
    }
    /**
     * Template path
     */
    get templateFile() {
        var _a, _b;
        return (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.template) ||
            path_1.default.resolve(this.srcDir, 'index.html'));
    }
    /**
     * Template output path
     */
    get outputTemplateFile() {
        return path_1.default.resolve(this.outputDirInServer, 'index.html');
    }
    /**
     * Get the configuration of browsers
     */
    getBrowsers(env) {
        var _a, _b;
        return (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.browsers) || {
            client: 'web',
            server: 'node'
        })[env];
    }
    /**
     * Create a renderer
     */
    createRenderer() {
        // @ts-ignore
        return new this.Renderer(this);
    }
}
exports.SSR = SSR;
