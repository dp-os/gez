import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class AnalyzerPlugin extends Plugin {
    chainWebpack({ config, target }: WebpackHookParams): void;
}
