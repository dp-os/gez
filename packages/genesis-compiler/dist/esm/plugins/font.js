import { Plugin } from '@fmfe/genesis-core';
export class FontPlugin extends Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('font')
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
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
