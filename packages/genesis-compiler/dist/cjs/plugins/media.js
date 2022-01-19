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
            .include.add(ssr.srcIncludes)
            .end()
            .set('type', 'asset/resource')
            .set('generator', {
            filename: 'media/[name].[hash][ext][query]'
        });
    }
}
exports.MediaPlugin = MediaPlugin;
