import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export class AnalyzerPlugin extends Plugin {
    public chainWebpack({ config, target }: WebpackHookParams) {
        if (target === 'client') {
            config.plugin('analyzer').use(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    generateStatsFile: true,
                    // Excludes module sources from stats file so there won't be any sensitive data
                    statsOptions: { source: false }
                })
            );
        }
    }
}
