import type * as Genesis from '.';
import { Plugin } from './plugin';
export declare class MFPlugin extends Plugin {
    renderBefore(context: Genesis.RenderContext): void;
}
export declare class MF {
    static is(ssr: Genesis.SSR): boolean;
    static get(ssr: Genesis.SSR): MF;
    ssr: Genesis.SSR;
    options: Genesis.MFOptions;
    entryName: string;
    constructor(ssr: Genesis.SSR, options?: Genesis.MFOptions);
    get name(): string;
    get exposes(): Record<string, string>;
    get remotes(): Genesis.MFRemote[];
    getWebpackPublicPathVarName(name: string): string;
    getExposes(version: string): void;
    getRemote(): void;
}
