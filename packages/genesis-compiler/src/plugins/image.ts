import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';

export class ImagePlugin extends Plugin {
    public webpackConfig({ config }: WebpackHookParams) {
        const { ssr } = this;
        config.module
            .rule('file')
            .test(/\.(png|jpe?g|gif|svg)$/i)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('file')
            .loader('file-loader')
            .options({
                esModule: false,
                publicPath: ssr.publicPath,
                name: this.ssr.isProd
                    ? 'images/[name].[contenthash:8].[ext]'
                    : 'images/[path][name].[ext]'
            });
    }
}
