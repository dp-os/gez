import path from 'path';
import process from 'process';
import * as Genesis from './';
import { PluginManage } from './plugin';
import { Renderer } from './renderer';
import { Format } from './format';

export class SSR {
    /**
     * Template renderer
     */

    public Format = Format;
    /**
     * Renderer
     */
    public Renderer = Renderer;
    /**
     * Constructor options
     */
    public options: Genesis.Options;
    /**
     * Plug in management
     */
    public plugin: Genesis.PluginManage = new PluginManage(this);
    /**
     * Constructor
     */
    public constructor(options: Genesis.Options = {}) {
        this.options = options;
        if ('name' in options && typeof options.name !== 'string') {
            throw new TypeError('Options.name can only be of string type');
        }
    }

    /**
     * Judge whether it is a production environment. By default, judge by process.env.NODE_ENV
     */
    public get isProd() {
        return process.env.NODE_ENV === 'production';
    }

    /**
     * Current app name, default is 'ssr-genesis'
     */
    public get name() {
        return this.options.name || 'ssr-genesis';
    }

    /**
     * The basic path of client static resource loading, which is '/ssr-genesis/' by default
     */
    public get publicPath() {
        return `/${this.name}/`;
    }

    /**
     * Project root
     */
    public get baseDir() {
        return this.options?.build?.baseDir || path.resolve();
    }

    /**
     * Compiled output directory
     */
    public get outputDir() {
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
    public get outputDirInClient() {
        return path.resolve(this.outputDir, './client');
    }

    /**
     * Server compile output directory
     */
    public get outputDirInServer() {
        return path.resolve(this.outputDir, './server');
    }

    /**
     * Static file directory
     */
    public get staticDir() {
        return path.resolve(this.outputDir, './client');
    }

    /**
     * Compile source entry directory
     */
    public get srcDir() {
        return path.resolve(this.baseDir, './src');
    }

    /**
     * Directory to be compiled by webpack
     */
    public get srcIncludes() {
        return [
            ...(this.options?.build?.transpile || []),
            this.srcDir,
            path.resolve(this.outputDir, './src')
        ];
    }

    public get transpile() {
        const transpile: RegExp[] = Object.assign(
            this.options?.build?.transpile || []
        );

        transpile.push(/@fmfe\/genesis-app/);

        return transpile;
    }

    /**
     * Client side compile entry file
     */
    public get entryClientFile() {
        return path.resolve(this.outputDir, 'src/entry-client');
    }

    /**
     * Server side compile entry file
     */
    public get entryServerFile() {
        return path.resolve(this.outputDir, 'src/entry-server');
    }

    /**
     * Name of manifest compiled by the client
     */
    public get clientManifestName() {
        return 'vue-ssr-client-manifest.json';
    }

    /**
     * Manifest file path of client
     */
    public get outputClientManifestFile() {
        return path.resolve(this.outputDirInServer, this.clientManifestName);
    }

    /**
     * Name of manifest compiled by the server
     */
    public get serverBundleName() {
        return 'vue-ssr-server-bundle.json';
    }

    /**
     * Manifest file path of server
     */
    public get outputServerBundleFile() {
        return path.resolve(this.outputDirInServer, this.serverBundleName);
    }

    /**
     * Template path
     */
    public get templaceFile() {
        return (
            this.options?.build?.template ||
            path.resolve(this.srcDir, 'index.html')
        );
    }

    /**
     * Template output path
     */
    public get outputTemplaceFile() {
        return path.resolve(this.outputDirInServer, 'index.html');
    }

    /**
     * Get the configuration of browsers
     */
    public getBrowsers(env: keyof Genesis.Browsers) {
        return (this.options?.build?.browsers || {
            client: ['ie >= 9', 'ios >= 5', 'android >= 4.0'],
            server: [`node >= ${process.versions.node}`]
        })[env];
    }

    /**
     * Create a renderer
     */
    public createRenderer(options?: Genesis.RendererOptions) {
        return new this.Renderer(this, options);
    }
}
