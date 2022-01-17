import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';

export class ImagePlugin extends Plugin {
    public chainWebpack({ config }: WebpackHookParams) {
        const { ssr } = this;
        config.module
            .rule('image')
            .test(/\.(png|jpe?g|gif|svg)$/i)
            .include.add(ssr.srcIncludes)
            .end()
            .set('type', 'asset/resource')
            .set('generator', {
                filename: 'images/[name].[hash][ext][query]'
            });
    }
}
