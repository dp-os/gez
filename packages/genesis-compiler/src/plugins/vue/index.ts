import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
import path from 'path';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import VueClientPlugin from 'vue-server-renderer/client-plugin';
import webpack from 'webpack';

function isJS(file: string) {
    return /\.js(\?[^.]+)?$/.test(file);
}
class VueSSRServerPlugin {
    public apply(compiler: webpack.Compiler) {
        const name = 'vue-server-plugin';
        compiler.hooks.compilation.tap(name, (compilation) => {
            if (compilation.compiler !== compiler) {
                return;
            }
            const stage =
                webpack.Compilation['PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER'];
            compilation.hooks.processAssets.tapAsync(
                { name, stage },
                (assets, cb) => {
                    Object.keys(compilation.assets).forEach(function (name) {
                        if (isJS(name)) {
                            return;
                        }
                        delete compilation.assets[name];
                    });
                    cb();
                }
            );
        });
    }
}

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
            case 'server':
                config.plugin('vue-ssr-server').use(VueSSRServerPlugin);
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
    }
}
