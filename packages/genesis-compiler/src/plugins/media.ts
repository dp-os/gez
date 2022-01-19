import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';

export class MediaPlugin extends Plugin {
    public chainWebpack({ config }: WebpackHookParams) {
        const { ssr } = this;
        config.module
            .rule('media')
            .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i)
            .include.add(ssr.srcIncludes)
            .end()
            .set('type', 'asset/resource')
            .set('generator', {
                filename: 'media/[name].[hash][ext][query]'
            });
    }
}
