import webpack from 'webpack';
interface VueClientPluginOptions {
    filename?: string;
}
export declare class VueClientPlugin {
    options: VueClientPluginOptions;
    constructor(options: VueClientPluginOptions);
    get filename(): string;
    apply(compiler: webpack.Compiler): void;
}
export {};
