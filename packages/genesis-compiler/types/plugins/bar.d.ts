import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class BarPlugin extends Plugin {
    chainWebpack({ target, config }: WebpackHookParams): void;
}
