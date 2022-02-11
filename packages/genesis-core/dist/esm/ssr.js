import path from 'path';
import process from 'process';
import { PluginManage } from './plugin';
import { Renderer } from './renderer';
export class SSR {
    constructor(options = {}) {
        /**
         * Renderer
         */
        this.Renderer = Renderer;
        this.entryName = 'app';
        this.sandboxGlobal = {
            Buffer,
            console,
            process,
            setTimeout,
            setInterval,
            setImmediate,
            clearTimeout,
            clearInterval,
            clearImmediate,
            URL
        };
        this.options = options;
        this.plugin = new PluginManage(this);
        if ('name' in options && typeof options.name !== 'string') {
            throw new TypeError('Options.name can only be of string type');
        }
        if (options.sandboxGlobal) {
            Object.assign(this.sandboxGlobal, options.sandboxGlobal);
        }
        this.sandboxGlobal.global = this.sandboxGlobal;
        Object.defineProperty(this.sandboxGlobal, this.publicPathVarName, {
            get: () => this.cdnPublicPath + this.publicPath
        });
    }
    static fixVarName(name) {
        return name.replace(/\W/g, '_');
    }
    static getPublicPathVarName(name) {
        return `__webpack_public_path_${SSR.fixVarName(name)}__`;
    }
    /**
     * Judge whether it is a production environment. By default, judge by process.env.NODE_ENV
     */
    get isProd() {
        return this.options?.isProd || process.env.NODE_ENV === 'production';
    }
    /**
     * Current app name, default is 'ssr-genesis'
     */
    get name() {
        return this.options.name || 'ssr-genesis';
    }
    get extractCSS() {
        if (this.isProd) {
            return this.options?.build?.extractCSS ?? true;
        }
        return false;
    }
    /**
     * The basic path of client static resource loading, which is '/ssr-genesis/' by default
     */
    get publicPath() {
        return this.options?.build?.publicPath || `/${this.name}/`;
    }
    get publicPathVarName() {
        return SSR.getPublicPathVarName(this.name);
    }
    /**
     * CDN resource public path, Only valid in production mode
     */
    get cdnPublicPath() {
        if (!this.isProd)
            return '';
        return this.options?.cdnPublicPath || '';
    }
    /**
     * Project root
     */
    get baseDir() {
        return this.options?.build?.baseDir || path.resolve();
    }
    /**
     * Compiled output directory
     */
    get outputDir() {
        if (this.options?.build?.outputDir) {
            if (path.isAbsolute(this.options.build.outputDir)) {
                return this.options.build.outputDir;
            }
            return path.resolve(this.baseDir, this.options.build.outputDir);
        }
        return path.resolve(this.baseDir, `./dist/${this.name}`);
    }
    /**
     * Client compile output directory
     */
    get outputDirInClient() {
        return path.resolve(this.outputDir, './client');
    }
    /**
     * Server compile output directory
     */
    get outputDirInServer() {
        return path.resolve(this.outputDir, './server');
    }
    /**
     * Static file directory
     */
    get staticDir() {
        return path.resolve(this.outputDir, './client');
    }
    /**
     * Compile source entry directory
     */
    get srcDir() {
        return path.resolve(this.baseDir, './src');
    }
    /**
     * Directory to be compiled by webpack
     */
    get srcIncludes() {
        return [
            ...this.transpile,
            this.srcDir,
            path.resolve(this.outputDir, './src')
        ];
    }
    get transpile() {
        return this.options?.build?.transpile || [];
    }
    /**
     * Client side compile entry file
     */
    get entryClientFile() {
        return path.resolve(this.outputDir, 'src/entry-client');
    }
    /**
     * Server side compile entry file
     */
    get entryServerFile() {
        return path.resolve(this.outputDir, 'src/entry-server');
    }
    /**
     * Manifest file path of client
     */
    get outputClientManifestFile() {
        return path.resolve(this.outputDirInServer, 'vue-ssr-client-manifest.json');
    }
    /**
     * Manifest file path of server
     */
    get outputServeAppFile() {
        return path.resolve(this.outputDirInServer, 'js/app.js');
    }
    /**
     * Template path
     */
    get templateFile() {
        return (this.options?.build?.template ||
            path.resolve(this.srcDir, 'index.html'));
    }
    /**
     * Template output path
     */
    get outputTemplateFile() {
        return path.resolve(this.outputDirInServer, 'index.html');
    }
    /**
     * Get the configuration of browsers
     */
    getBrowsers(env) {
        return (this.options?.build?.browsers || {
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
