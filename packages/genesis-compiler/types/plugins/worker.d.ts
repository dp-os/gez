import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class WorkerPlugin extends Plugin {
    chainWebpack({ config }: WebpackHookParams): void;
}
