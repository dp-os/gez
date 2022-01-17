"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagePlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
class ImagePlugin extends genesis_core_1.Plugin {
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
exports.ImagePlugin = ImagePlugin;
