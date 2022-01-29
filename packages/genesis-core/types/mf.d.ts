import type * as Genesis from '.';
export declare class MF {
    static varName(name: string): string;
    static exposesVarName(name: string, exposesEntryName: string): string;
    static is(ssr: Genesis.SSR): boolean;
    static get(ssr: Genesis.SSR): MF;
    ssr: Genesis.SSR;
    options: Genesis.MFOptions;
    constructor(ssr: Genesis.SSR, options?: Genesis.MFOptions);
    get name(): string;
    get exposes(): Record<string, string>;
    get remotes(): Genesis.MFRemote[];
    getExposes(version: string): void;
    getRemote(): void;
}
