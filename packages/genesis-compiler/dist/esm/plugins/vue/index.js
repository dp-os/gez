import path from 'path';
import webpack from 'webpack';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import { Plugin } from '@fmfe/genesis-core';
import VueClientPlugin from 'vue-server-renderer/client-plugin';
import VueServerPlugin from 'vue-server-renderer/server-plugin';
export class VuePlugin extends Plugin {
    chainWebpack({ target, config }) {
        const { ssr } = this;
        switch (target) {
            case 'client':
                config.plugin('vue-ssr-client').use(VueClientPlugin, [
                    {
                        filename: path.relative(ssr.outputDirInClient, ssr.outputClientManifestFile)
                    }
                ]);
                break;
            case 'server':
                config.plugin('vue-ssr-server').use(new VueServerPlugin({
                    filename: path.relative(ssr.outputDirInServer, ssr.outputServerBundleFile)
                }));
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
            .options(target === 'client'
            ? {}
            : {
                optimizeSSR: true
            });
        config.plugin('vue').use(VueLoaderPlugin);
        config.plugin('define').use(webpack.DefinePlugin, [
            {
                'process.env.VUE_ENV': JSON.stringify(target),
                'process.env.GENESIS_NAME': JSON.stringify(ssr.name)
            }
        ]);
    }
}
