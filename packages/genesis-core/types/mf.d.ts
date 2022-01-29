import type * as Genesis from '.';
export declare class MF {
    static varName(name: string): string;
    static exposesVarName(name: string, exposesEntryName: string): string;
    ssr: Genesis.SSR;
    constructor(ssr: Genesis.SSR);
    get name(): string;
    getExposes(version: string): void;
    getRemote(): void;
}
