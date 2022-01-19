import { Renderer, SSR } from '@fmfe/genesis-core';
import { BaseGenesis } from '../utils';
import { ClientConfig } from '../webpack';
export declare class WatchClientConfig extends ClientConfig {
    constructor(ssr: SSR);
}
export declare class Watch extends BaseGenesis {
    devMiddleware: any;
    hotMiddleware: any;
    private _renderer;
    constructor(ssr: SSR);
    get renderer(): Renderer;
    set renderer(renderer: Renderer);
    start(): Promise<void>;
    destroy(): void;
    private notify;
}
