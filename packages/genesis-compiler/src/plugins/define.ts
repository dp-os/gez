import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
import webpack from 'webpack';

export class DefinePlugin extends Plugin {
    public chainWebpack({ target, config }: WebpackHookParams) {
        const { ssr } = this;
        config.plugin('define').use(webpack.DefinePlugin, [
            {
                'process.env.VUE_ENV': JSON.stringify(target),
                'process.env.GENESIS_NAME': JSON.stringify(ssr.name),
                'process.env.PUBLIC_PATH_VAR_NAME': JSON.stringify(ssr.publicPathVarName)
            }
        ]);
    }
}
