import type * as Genesis from '.';
export declare class Mf {
    ssr: Genesis.SSR;
    constructor(ssr: Genesis.SSR);
    getExposes(version: string): void;
    getRemote(): void;
}
