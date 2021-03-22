import { SSR } from '@fmfe/genesis-core';
export interface BuildOptions {
    analyzer?: boolean;
}
export declare class Build {
    ssr: SSR;
    constructor(ssr: SSR, options?: BuildOptions);
    start(): Promise<[boolean, boolean]>;
}
