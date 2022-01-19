import Genesis from '@fmfe/genesis-core';
export declare class BaseGenesis {
    ssr: Genesis.SSR;
    constructor(ssr: Genesis.SSR);
}
export declare function getFilename(ssr: Genesis.SSR, type: string): string;
export declare const deleteFolder: (path: string) => void;
