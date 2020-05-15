"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BabelPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
class BabelPlugin extends genesis_core_1.Plugin {
    chainWebpack({ target, config }) {
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
                    corejs: false
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
                    targets: this.ssr.getBrowsers(target)
                }
            ]
        ];
        const jsRule = config.module
            .rule('js')
            .test(/\.m?jsx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({
            plugins,
            presets
        })
            .end();
        config.module
            .rule('ts')
            .test(/\.(t)sx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({
            plugins,
            presets: [
                [
                    'babel-preset-typescript-vue',
                    {
                        allowNamespaces: true
                    }
                ],
                ...presets
            ]
        })
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
