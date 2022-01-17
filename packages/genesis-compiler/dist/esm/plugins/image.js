import { Plugin } from '@fmfe/genesis-core';
export class ImagePlugin extends Plugin {
    chainWebpack({ config }) {
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
