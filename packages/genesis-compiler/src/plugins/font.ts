import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';

export class FontPlugin extends Plugin {
    public chainWebpack({ config }: WebpackHookParams) {
        const { ssr } = this;
        config.module
            .rule('font')
            .test(/\.(eot|ttf|woff|woff2)$/i)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('file')
            .loader('file-loader')
            .options({
                esModule: false,
                name: this.ssr.isProd
                    ? 'fonts/[name].[contenthash:8].[ext]'
                    : 'fonts/[path][name].[ext]'
            });
    }
}
