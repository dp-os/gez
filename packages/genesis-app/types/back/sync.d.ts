import Router, { RawLocation, Route } from 'vue-router';
export declare function catchError(this: Router, err: any): Route | Promise<never>;
export declare class Sync {
    private list;
    private onPopstate;
    constructor();
    add(router: Router): void;
    del(router: Router): void;
    to(location?: RawLocation): Promise<Route | null>;
    toHistory(location: RawLocation, router: Router, state?: any, replace?: boolean): Promise<Route>;
}
export declare const sync: Sync;
