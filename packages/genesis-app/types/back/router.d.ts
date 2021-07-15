import VueRouter, { RouterOptions, RawLocation } from 'vue-router';
export declare class Router extends VueRouter {
    constructor(options?: RouterOptions);
    get state(): any;
    push(location: RawLocation): any;
    pushState(location: RawLocation, state: any): any;
    replace(location: RawLocation): any;
    replaceState(location: RawLocation, state: any): Promise<import("vue-router").Route>;
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
        sourceMode?: RouterMode;
    }
}
