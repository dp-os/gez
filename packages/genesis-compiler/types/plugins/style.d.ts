import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class StylePlugin extends Plugin {
    chainWebpack({ target, config }: WebpackHookParams): Promise<void>;
}
