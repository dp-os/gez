import type * as Genesis from '.';
import { Plugin } from './plugin';
declare class Remote {
    ssr: Genesis.SSR;
    options: Genesis.MFRemote;
    version: string;
    clientVersion: string;
    serverVersion: string;
    constructor(ssr: Genesis.SSR, options: Genesis.MFRemote);
    get mf(): MF;
    parse(version: string): void;
    get(): Promise<void>;
    inject(): string;
}
declare class Exposes {
    ssr: Genesis.SSR;
    constructor(ssr: Genesis.SSR);
    get mf(): MF;
    get(version?: string): Promise<{
        version: string;
        files: {};
    }>;
    read(fullPath: string): any;
}
export declare class MFPlugin extends Plugin {
    remotes: Remote[];
    constructor(ssr: Genesis.SSR);
    getRemote(): Promise<void[]>;
    renderBefore(context: Genesis.RenderContext): void;
}
export declare class MF {
    static is(ssr: Genesis.SSR): boolean;
    static get(ssr: Genesis.SSR): MF;
    options: Required<Genesis.MFOptions>;
    entryName: string;
    protected ssr: Genesis.SSR;
    protected mfPlugin: MFPlugin;
    protected exposes: Exposes;
    constructor(ssr: Genesis.SSR, options?: Genesis.MFOptions);
    get name(): string;
    get outputExposesVersion(): string;
    get outputExposesFiles(): string;
    getWebpackPublicPathVarName(name: string): string;
    getExposes(version: string): Promise<{
        version: string;
        files: {};
    }>;
    getRemote(): Promise<void[]>;
}
export {};
