import { CompilerType, Plugin, SSR, WebpackHookParams } from '@fmfe/genesis-core';
export declare class MFPlugin extends Plugin {
    constructor(ssr: SSR);
    chainWebpack({ config, target }: WebpackHookParams): void;
    afterCompiler(type: CompilerType): void;
    private _getVersion;
    private _getFiles;
    private _getFilename;
}
