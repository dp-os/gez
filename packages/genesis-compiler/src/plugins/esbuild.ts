import { Plugin } from '@fmfe/genesis-core';

export class ESBuildPlugin extends Plugin {
    public async chainWebpack({ config }) {
        const options = this.ssr.options.build?.esbuild || {
            target: 'es2015'
        };
        config.resolve.extensions.prepend('.js').prepend('.ts');
        config.module
            .rule('js')
            .test(/\.m?jsx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('esbuild')
            .loader('esbuild-loader')
            .options({
                ...options
            })
            .end();
        config.module
            .rule('ts')
            .test(/\.(t)sx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('esbuild')
            .loader('esbuild-loader')
            .options({
                ...options
            })
            .end();
    }
}
