import VueRouter, { Route, RouterOptions, RouterMode, RawLocation } from 'vue-router';
export declare function getLocation(base: string): string;
export declare class Router extends VueRouter {
    protected sourceMode: RouterMode;
    constructor(options?: RouterOptions);
    get _isSync(): boolean;
    get state(): any;
    push(location: RawLocation): Promise<Route>;
    pushState(location: RawLocation, data: any): Promise<Route>;
    replace(location: RawLocation): Promise<Route>;
    replaceState(location: RawLocation, data: any): Promise<Route>;
    go(n: number): void;
    back(): void;
    forward(): void;
}
declare module 'vue-router/types/router' {
    interface VueRouter {
        state: any;
        pushState(location: RawLocation, data: any): Promise<Route>;
        replaceState(location: RawLocation, data: any): Promise<Route>;
    }
    interface RouterOptions {
        /**
         * Whether to synchronize to history when routing changes
         */
        syncHistory?: boolean;
    }
}
