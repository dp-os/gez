import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class BabelPlugin extends Plugin {
    chainWebpack({ target, config }: WebpackHookParams): Promise<void>;
}
