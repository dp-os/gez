import Router, { RawLocation, Route } from 'vue-router';

const isWindow = typeof window === 'object';

function transitionTo(router: any, location: RawLocation) {
    return new Promise<Route>((resolve, reject) => {
        router.history.transitionTo(location, resolve, reject);
    });
}

function cleanPath(path: string): string {
    return path.replace(/\/\//g, '/');
}

function getLocation(base: string): string {
    let path = window.location.pathname;
    const pathLowerCase = path.toLowerCase();
    const baseLowerCase = base.toLowerCase();
    if (
        base &&
        (pathLowerCase === baseLowerCase ||
            pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0)
    ) {
        path = path.slice(base.length);
    }
    return (path || '/') + window.location.search + window.location.hash;
}

export function catchError(this: Router, err: any) {
    if (err && typeof err === 'object' && err.name === 'NavigationDuplicated') {
        return this.currentRoute;
    }
    return Promise.reject(err);
}

export class Sync {
    private list: Router[] = [];
    private onPopstate: () => void;
    public constructor() {
        this.onPopstate = () => {
            this.to();
        };
    }
    public add(router: Router) {
        if (isWindow && this.list.length === 0) {
            window.addEventListener('popstate', this.onPopstate);
        }
        this.list.push(router);
    }
    public del(router: Router) {
        const index = this.list.indexOf(router);
        if (index > -1) {
            this.list.splice(index, 1);
        }
        if (isWindow && this.list.length === 0) {
            window.removeEventListener('popstate', this.onPopstate);
        }
    }
    public to(location?: RawLocation): Promise<Route | null> {
        const list = this.list;
        const queue = [...list];
        const next = () => {
            const router = queue.shift();
            if (!router)
                return list.length ? list[list.length - 1].currentRoute : null;
            if (!location) {
                const base = router.options.base || '';
                location = getLocation(base);
            }
            return transitionTo(router, location)
                .then(next)
                .catch(catchError.bind(router));
        };
        return next();
    }
    public toHistory(
        location: RawLocation,
        router: Router,
        state: any = {},
        replace?: boolean
    ) {
        return this.to(location).then((route) => {
            if (route && isWindow) {
                const base = router.options.base || '';
                const url = cleanPath(base + route.fullPath);
                if (replace) {
                    history.replaceState(state, '', url);
                } else {
                    history.pushState(state, '', url);
                }
            }
            return route;
        });
    }
}

function createSync(): Sync {
    const key = '__syncRouter';
    if (isWindow && window[key]) {
        return window[key];
    }
    const sync = new Sync();

    if (isWindow) {
        window[key] = sync;
    }

    return sync;
}

export const sync = createSync();
