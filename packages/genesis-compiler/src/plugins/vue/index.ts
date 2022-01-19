import { CompilerType, Plugin, WebpackHookParams } from '@fmfe/genesis-core';
import fs from 'fs';
import path from 'path';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import VueClientPlugin from 'vue-server-renderer/client-plugin';
import webpack from 'webpack';

export class VuePlugin extends Plugin {
    public chainWebpack({ target, config }: WebpackHookParams) {
        const { ssr } = this;
        switch (target) {
            case 'client':
                config.plugin('vue-ssr-client').use(VueClientPlugin, [
                    {
                        filename: path.relative(
                            ssr.outputDirInClient,
                            ssr.outputClientManifestFile
                        )
                    }
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
            .options(
                target === 'client'
                    ? {}
                    : {
                          optimizeSSR: true
                      }
            );
        config.plugin('vue').use(VueLoaderPlugin);
        config.plugin('define').use(webpack.DefinePlugin, [
            {
                'process.env.VUE_ENV': JSON.stringify(target),
                'process.env.GENESIS_NAME': JSON.stringify(ssr.name)
            }
        ]);
    }
}
