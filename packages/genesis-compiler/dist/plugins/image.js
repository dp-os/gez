"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genesis_core_1 = require("@fmfe/genesis-core");
class ImagePlugin extends genesis_core_1.Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('file')
            .test(/\.(png|jpe?g|gif|svg)$/i)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('file')
            .loader('file-loader')
            .options({
            esModule: false,
            publicPath: ssr.publicPath,
            name: this.ssr.isProd
                ? 'images/[name].[contenthash:8].[ext]'
                : 'images/[path][name].[ext]'
        });
    }
}
exports.ImagePlugin = ImagePlugin;
