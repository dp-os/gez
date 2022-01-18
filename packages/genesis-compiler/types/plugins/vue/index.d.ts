import { CompilerType, Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export declare class VuePlugin extends Plugin {
    chainWebpack({ target, config }: WebpackHookParams): void;
    afterCompiler(type: CompilerType): void;
}
