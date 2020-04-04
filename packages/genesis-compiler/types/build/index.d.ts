import { SSR } from '@fmfe/genesis-core';
export declare class Build {
    ssr: SSR;
    constructor(ssr: SSR);
    start(): Promise<[boolean, boolean]>;
}
