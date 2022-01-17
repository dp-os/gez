import { Plugin } from '@fmfe/genesis-core';
export class FontPlugin extends Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('font')
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
            .include.add(ssr.srcIncludes)
            .end()
            .set('type', 'asset/resource')
            .set('generator', {
            filename: 'images/[name].[hash][ext][query]'
        });
    }
}
