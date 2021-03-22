"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
class AnalyzerPlugin extends genesis_core_1.Plugin {
    chainWebpack({ config, target }) {
        if (target === 'client') {
            config.plugin('analyzer').use(new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: 'static',
                generateStatsFile: true,
                // Excludes module sources from stats file so there won't be any sensitive data
                statsOptions: { source: false }
            }));
        }
    }
}
exports.AnalyzerPlugin = AnalyzerPlugin;
