import VueRouter, { RouterOptions, RawLocation } from 'vue-router';
export declare function getLocation(base: string): string;
export declare class Router extends VueRouter {
    constructor(options?: RouterOptions);
    push(location: RawLocation): Promise<import("vue-router").Route>;
    replace(location: RawLocation): Promise<import("vue-router").Route>;
    go(n: number): void;
    back(): void;
    forward(): void;
}
