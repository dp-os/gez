import path from 'path';
import webpack from 'webpack';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin';

import VueLoaderPlugin from 'vue-loader/lib/plugin';
import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';

export class VuePlugin extends Plugin {
    public chainWebpack({ target, config }: WebpackHookParams) {
        const { ssr } = this;
        switch (target) {
            case 'client':
                config.plugin('vue-ssr-client').use(VueSSRClientPlugin, [
                    {
                        filename: path.relative(
                            ssr.outputDirInClient,
                            ssr.outputClientManifestFile
                        )
                    }
                ]);
                break;
            case 'server':
                config.plugin('vue-ssr-server').use(VueSSRServerPlugin, [
                    {
                        optimizeSSR: true,
                        filename: path.relative(
                            ssr.outputDirInServer,
                            ssr.outputServerBundleFile
                        )
                    } as any
                ]);
                break;
        }
        config.resolve.extensions.add('.vue');
        config.module
            .rule('vue')
            .test(/\.vue$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('vue')
            .loader('vue-loader')
            .options({});
        config.plugin('vue').use(VueLoaderPlugin);
        config.plugin('define').use(webpack.DefinePlugin, [
            {
                'process.env.NODE_ENV': JSON.stringify(
                    process.env.NODE_ENV || 'development'
                ),
                'process.env.VUE_ENV': JSON.stringify(target),
                'process.env.GENESIS_NAME': JSON.stringify(ssr.name)
            }
        ]);
    }
}
