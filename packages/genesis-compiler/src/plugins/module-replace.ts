import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
import webpack from 'webpack';

export class ModuleReplacePlugin extends Plugin {
    public chainWebpack({ config }: WebpackHookParams) {
        const { moduleReplace } = this.ssr;
        if (Object.keys(moduleReplace).length === 0) return;
        config.plugin('ModuleReplace').use(webpack.NormalModuleReplacementPlugin, [
            /(.*)/,
            (resource) => {
                if (resource.request in moduleReplace) {
                    const value = moduleReplace[resource.request];
                    const request = typeof value === 'string' ? value : value(resource);

                    if (resource.contextInfo.issuer !== request) {
                        resource.request = request;
                    }
                }
            }
        ]);
    }
}
