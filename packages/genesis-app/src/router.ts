import Vue from 'vue';
import VueRouter, { RouterOptions, RawLocation } from 'vue-router';

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
        this.list.forEach((router) => {
            if (this.target === router) return;
            fn(router);
        });
        this.target = null;
    }

    public push(location: string) {
        this.sync((router) => {
            router.push(location);
        });
        if (!this.list.length) return;
        history.pushState({}, '', location);
    }

    public replace(location: string) {
        this.sync((router) => {
            router.replace(location);
        });
        if (!this.list.length) return;
        history.replaceState({}, '', location);
    }

    public go(n: number) {
        this.sync((router) => {
            router.go(n);
        });
    }

    public back() {
        this.sync((router) => {
            router.back();
        });
    }

    public forward() {
        this.sync((router) => {
            router.forward();
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
    public constructor(options: RouterOptions = {}) {
        super({
            ...options,
            mode: 'abstract'
        });
        if (!route || options.mode !== 'history') return;
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

    public async push(location: RawLocation) {
        const url = this.resolve(location).href;
        const v = await super.push(location);
        route && route.dispatchTarget(this).push(url);
        return v;
    }

    public async replace(location: RawLocation) {
        const url = this.resolve(location).href;
        const v = await super.replace(location);
        route && route.dispatchTarget(this).replace(url);
        return v;
    }

    public go(n: number) {
        route && route.dispatchTarget(this).go(n);
        return super.go(n);
    }

    public back() {
        route && route.dispatchTarget(this).back();
        return super.back();
    }

    public forward() {
        route && route.dispatchTarget(this).forward();
        return super.forward();
    }
}
