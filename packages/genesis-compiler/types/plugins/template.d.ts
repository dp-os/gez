import { CompilerType, Plugin } from '@fmfe/genesis-core';
export declare class TemplatePlugin extends Plugin {
    beforeCompiler(): Promise<void>;
    afterCompiler(type: CompilerType): Promise<void>;
}
