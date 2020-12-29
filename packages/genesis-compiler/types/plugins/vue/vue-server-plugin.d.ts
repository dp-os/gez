import webpack from 'webpack';
interface VueServerPluginOptions {
    filename: string;
}
export declare class VueServerPlugin {
    options: Partial<VueServerPluginOptions>;
    constructor(options: Partial<VueServerPluginOptions>);
    get filename(): string;
    apply(compiler: webpack.Compiler): void;
}
export {};
