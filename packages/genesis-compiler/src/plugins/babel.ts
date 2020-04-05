import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export class BabelPlugin extends Plugin {
    public chainWebpack({ target, config }: WebpackHookParams) {
        const { isProd } = this.ssr;
        config.resolve.extensions.prepend('.js').prepend('.ts');
        const jsRule = config.module
            .rule('js')
            .test(/\.m?(j|t)sx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({
                plugins: [
                    ['@babel/plugin-transform-modules-commonjs'],
                    ['@babel/plugin-proposal-decorators', { legacy: true }],
                    ['@babel/plugin-proposal-export-default-from'],
                    [
                        '@babel/plugin-proposal-class-properties',
                        { loose: true }
                    ],
                    [
                        '@babel/plugin-transform-runtime',
                        {
                            corejs: false
                        }
                    ]
                ],
                presets: [
                    [
                        'babel-preset-typescript-vue',
                        {
                            allowNamespaces: true
                        }
                    ],
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                            useBuiltIns: 'usage',
                            corejs: 3,
                            targets: this.ssr.getBrowsers(target)
                        }
                    ]
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
