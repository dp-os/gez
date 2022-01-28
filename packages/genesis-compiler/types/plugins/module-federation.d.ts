import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class ModuleFederationPlugin extends Plugin {
    chainWebpack({ config, target }: WebpackHookParams): void;
}
