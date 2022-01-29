import { Plugin, WebpackHookParams, CompilerType } from '@fmfe/genesis-core';
export declare class MFPlugin extends Plugin {
    chainWebpack({ config, target }: WebpackHookParams): void;
    afterCompiler(type: CompilerType): void;
    private _getVersion;
    private _getFiles;
}
