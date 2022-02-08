import type * as Genesis from '.';
import { Plugin } from './plugin';
import type { Renderer } from './renderer';
import { SSR } from './ssr';
interface Data {
    version: string;
    clientVersion: string;
    serverVersion: string;
    files: {};
}
declare class RemoteItem {
    ssr: Genesis.SSR;
    options: Genesis.MFRemote;
    version: string;
    clientVersion: string;
    serverVersion: string;
    ready: ReadyPromise<true>;
    private eventsource?;
    private remoteModule;
    private renderer?;
    constructor(ssr: Genesis.SSR, options: Genesis.MFRemote);
    get mf(): MF;
    get baseDir(): string;
    init(renderer?: Renderer): Promise<void>;
    onMessage: (evt: MessageEvent) => void;
    destroy(): void;
    inject(): string;
}
declare class Remote {
    items: RemoteItem[];
    ssr: SSR;
    constructor(ssr: Genesis.SSR);
    get mf(): MF;
    inject(): string;
    init(...args: Parameters<RemoteItem['init']>): Promise<void[]>;
}
declare type ExposesWatchCallback = (data: Data) => void;
declare class Exposes {
    ssr: Genesis.SSR;
    private subs;
    constructor(ssr: Genesis.SSR);
    get mf(): MF;
    watch(cb: ExposesWatchCallback, version?: string): () => void;
    emit(): void;
    readText(fullPath: string): string;
}
export declare class MFPlugin extends Plugin {
    constructor(ssr: Genesis.SSR);
    get mf(): MF;
    renderBefore(context: Genesis.RenderContext): void;
}
export declare class MF {
    static is(ssr: Genesis.SSR): boolean;
    static get(ssr: Genesis.SSR): MF;
    options: Required<Genesis.MFOptions>;
    exposes: Exposes;
    remote: Remote;
    entryName: string;
    protected ssr: Genesis.SSR;
    protected mfPlugin: MFPlugin;
    constructor(ssr: Genesis.SSR, options?: Genesis.MFOptions);
    get name(): string;
    get outputExposesVersion(): string;
    get outputExposesFiles(): string;
    getWebpackPublicPathVarName(name: string): string;
}
export declare class ReadyPromise<T> {
    /**
     * 执行完成
     */
    finish: (value: T) => void;
    /**
     * 等待执行完成
     */
    await: Promise<T>;
    /**
     * 是否已经执行完成
     */
    finished: boolean;
    constructor();
    get loading(): boolean;
}
export {};
