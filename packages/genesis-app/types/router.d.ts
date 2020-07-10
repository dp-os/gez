import VueRouter, { Route, RouterOptions, RawLocation } from 'vue-router';
export declare function getLocation(base: string): string;
export declare class Router extends VueRouter {
    private _mode;
    constructor(options?: RouterOptions);
    get _isSync(): boolean;
    push(location: RawLocation): Promise<Route>;
    replace(location: RawLocation): Promise<Route>;
    go(n: number): void;
    back(): void;
    forward(): void;
}
