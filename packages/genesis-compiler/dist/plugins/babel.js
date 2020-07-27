"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BabelPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
class BabelPlugin extends genesis_core_1.Plugin {
    async chainWebpack({ target, config }) {
        const { isProd } = this.ssr;
        config.resolve.extensions.prepend('.js').prepend('.ts');
        const plugins = [
            ['@babel/plugin-transform-modules-commonjs'],
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-export-default-from'],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: false,
                    helpers: false
                }
            ]
        ];
        const presets = [
            [
                '@babel/preset-env',
                {
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 3,
                    include: [
                        'es.array.*',
                        'es.promise.*',
                        'es.object.assign',
                        'es.promise'
                    ],
                    targets: this.ssr.getBrowsers(target)
                }
            ]
        ];
        const presetsTS = [
            [
                'babel-preset-typescript-vue',
                {
                    allowNamespaces: true
                }
            ],
            ...presets
        ];
        const babeljs = {
            target,
            plugins,
            presets
        };
        const babelts = {
            target,
            plugins,
            presets: presetsTS
        };
        Object.defineProperty(babeljs, 'target', {
            writable: false,
            enumerable: false
        });
        Object.defineProperty(babelts, 'target', {
            writable: false,
            enumerable: false
        });
        await this.ssr.plugin.callHook('babel', babeljs);
        await this.ssr.plugin.callHook('babel', babelts);
        const jsRule = config.module
            .rule('js')
            .test(/\.m?jsx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options(babeljs)
            .end();
        config.module
            .rule('ts')
            .test(/\.(t)sx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options(babelts)
            .end();
        if (isProd) {
            jsRule
                .use('thread-loader')
                .loader('thread-loader')
                .end();
        }
    }
}
exports.BabelPlugin = BabelPlugin;
