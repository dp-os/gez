import { Plugin, CompilerType } from '@fmfe/genesis-core';
export declare class TemplacePlugin extends Plugin {
    beforeCompiler(): Promise<void>;
    afterCompiler(type: CompilerType): Promise<void>;
}
