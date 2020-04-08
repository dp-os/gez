import Vue from 'vue';
import VueRouter, { RouterOptions, RouterMode, RawLocation } from 'vue-router';

Vue.use(VueRouter);

export function getLocation(base: string): string {
    let path = decodeURI(window.location.pathname);
    if (base && path.indexOf(base) === 0) {
        path = path.slice(base.length);
    }
    return (path || '/') + window.location.search + window.location.hash;
}

class GenesisAppRouter {
    public static key = '__genesisAppRouter';
    private list: VueRouter[] = [];
    private target: VueRouter | null;
    private syncing = false;
    public constructor() {
        window.addEventListener('popstate', (e) => {
            this.sync((router: any) => {
                // Here is a Fang'f that vue-router does not disclose
                const location = getLocation(router.base);
                (router as any).history.transitionTo(location);
            });
        });
    }

    public set(router: VueRouter) {
        if (this.list.indexOf(router) > -1) return;
        this.list.push(router);
    }

    public clear(router: VueRouter) {
        const index = this.list.indexOf(router);
        this.list.splice(index, 1);
    }

    public dispatchTarget(target: VueRouter) {
        this.target = target;
        return this;
    }

    public sync(fn: (router: VueRouter) => void) {
        if (this.syncing) return;
        this.syncing = true;
        this.list.forEach((router) => {
            if (this.target === router) return;
            fn(router);
        });
        this.target = null;
        this.syncing = false;
    }

    public push(location: string) {
        this.sync((router) => {
            if (router.currentRoute.fullPath === location) return;
            VueRouter.prototype.push.call(router, location);
        });
    }

    public replace(location: string) {
        this.sync((router) => {
            if (router.currentRoute.fullPath === location) return;
            VueRouter.prototype.replace.call(router, location);
        });
    }
}

const getRoute = (): GenesisAppRouter | null => {
    if (typeof window === 'object') {
        const win: any = window;
        if (!win[GenesisAppRouter.key]) {
            win[GenesisAppRouter.key] = new GenesisAppRouter();
        }
        return win[GenesisAppRouter.key];
    }
    return null;
};

const route: GenesisAppRouter = getRoute();

export class Router extends VueRouter {
    private _mode: RouterMode = 'abstract';
    public constructor(options: RouterOptions = {}) {
        super({
            ...options,
            mode: 'abstract'
        });
        this._mode = options.mode;
        if (!this._isSync) return;
        route.set(this);
        let app = this.app;
        let remove = false;
        Object.defineProperty(this, 'app', {
            set(v) {
                app = v;
                if (!app) {
                    route.clear(this);
                    remove = true;
                    return;
                }
                if (app && remove) {
                    route.set(this);
                    remove = false;
                }
            },
            get() {
                return app;
            }
        });
    }

    public get _isSync() {
        return this._mode === 'history' && !!route;
    }

    public async push(location: RawLocation) {
        const url = this.resolve(location).href;
        const v = await super.push(location);
        if (this._isSync) {
            route.dispatchTarget(this).push(url);
            history.pushState({}, '', url);
        }
        return v;
    }

    public async replace(location: RawLocation) {
        const url = this.resolve(location).href;
        const v = await super.replace(location);
        if (this._isSync) {
            route.dispatchTarget(this).replace(url);
            history.replaceState({}, '', url);
        }
        return v;
    }

    public go(n: number) {
        if (this._isSync) {
            return history.go(n);
        }
        return super.go(n);
    }

    public back() {
        if (this._isSync) {
            return history.back();
        }
        return super.back();
    }

    public forward() {
        if (this._isSync) {
            return history.forward();
        }
        return super.forward();
    }
}
