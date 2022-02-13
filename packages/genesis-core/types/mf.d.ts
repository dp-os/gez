import type * as Genesis from '.';
import { Plugin } from './plugin';
import type { Renderer } from './renderer';
import { SSR } from './ssr';
interface ManifestJson {
    createTime: number;
    client: string;
    server: string;
    dts: boolean;
}
declare class Remote {
    ssr: Genesis.SSR;
    options: Genesis.MFRemote;
    manifest: ManifestJson;
    ready: ReadyPromise<true>;
    private remoteModule;
    private renderer?;
    private startTime;
    private timer?;
    private already;
    constructor(ssr: Genesis.SSR, options: Genesis.MFRemote);
    get mf(): MF;
    get clientPublicPath(): string;
    get serverPublicPath(): string;
    get baseDir(): string;
    init(renderer?: Renderer): Promise<void>;
    getWrite(server: string): string;
    connect(): Promise<void>;
    download(zipName: string, writeDir: string, cb?: (name: string) => void): Promise<boolean>;
    destroy(): void;
    inject(): string;
}
declare class RemoteGroup {
    items: Remote[];
    ssr: SSR;
    constructor(ssr: Genesis.SSR);
    get mf(): MF;
    inject(): string;
    init(...args: Parameters<Remote['init']>): Promise<void[]>;
}
declare type ExposesWatchCallback = () => void;
declare class Exposes {
    ssr: Genesis.SSR;
    private subs;
    constructor(ssr: Genesis.SSR);
    get mf(): MF;
    watch(cb: ExposesWatchCallback): void;
    emit(): void;
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
    remote: RemoteGroup;
    entryName: string;
    protected ssr: Genesis.SSR;
    protected mfPlugin: MFPlugin;
    constructor(ssr: Genesis.SSR, options?: Genesis.MFOptions);
    get haveExposes(): boolean;
    get name(): string;
    get output(): string;
    get outputManifest(): string;
    get manifestRoutePath(): string;
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
