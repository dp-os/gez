"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
class MediaPlugin extends genesis_core_1.Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('media')
            .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('file')
            .loader('file-loader')
            .options({
            esModule: false,
            name: this.ssr.isProd
                ? 'medias/[name].[contenthash:8].[ext]'
                : 'medias/[path][name].[ext]'
        });
    }
}
exports.MediaPlugin = MediaPlugin;
