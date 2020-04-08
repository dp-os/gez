import VueRouter, { RouterOptions, RawLocation } from 'vue-router';
export declare function getLocation(base: string): string;
declare class GenesisAppRouter {
    static key: string;
    private list;
    private target;
    private syncing;
    constructor();
    set(router: VueRouter): void;
    clear(router: VueRouter): void;
    dispatchTarget(target: VueRouter): this;
    sync(fn: (router: VueRouter) => void): void;
    push(location: string): void;
    replace(location: string): void;
    go(n: number): void;
    back(): void;
    forward(): void;
}
export declare class Router extends VueRouter {
    private _mode;
    constructor(options?: RouterOptions);
    get _isSync(): GenesisAppRouter;
    push(location: RawLocation): Promise<import("vue-router").Route>;
    replace(location: RawLocation): Promise<import("vue-router").Route>;
    go(n: number): void;
    back(): void;
    forward(): void;
}
export {};
