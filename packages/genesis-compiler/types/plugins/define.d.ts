import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class DefinePlugin extends Plugin {
    chainWebpack({ target, config }: WebpackHookParams): void;
}
