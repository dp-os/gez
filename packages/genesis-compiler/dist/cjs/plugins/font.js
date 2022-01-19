"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
class FontPlugin extends genesis_core_1.Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('font')
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
            .include.add(ssr.srcIncludes)
            .end()
            .set('type', 'asset/resource')
            .set('generator', {
            filename: 'fonts/[name].[hash][ext][query]'
        });
    }
}
exports.FontPlugin = FontPlugin;
