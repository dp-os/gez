import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';

export class FontPlugin extends Plugin {
    public chainWebpack({ config }: WebpackHookParams) {
        const { ssr } = this;
        config.module
            .rule('font')
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
            .include.add(ssr.srcIncludes)
            .end()
            .set('type', 'asset/resource')
            .set('generator', {
                filename: 'fonts/[name].[hash][ext][query]'
            });
    }
}
