"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.getLocation = void 0;
const vue_1 = __importDefault(require("vue"));
const vue_router_1 = __importDefault(require("vue-router"));
vue_1.default.use(vue_router_1.default);
function getLocation(base) {
    let path = decodeURI(window.location.pathname);
    if (base && path.indexOf(base) === 0) {
        path = path.slice(base.length);
    }
    return (path || '/') + window.location.search + window.location.hash;
}
exports.getLocation = getLocation;
class GenesisAppRouter {
    constructor() {
        this.list = [];
        this.syncing = false;
        window.addEventListener('popstate', (e) => {
            this.sync((router) => {
                // Here is a Fang'f that vue-router does not disclose
                const location = getLocation(router.base);
                router.history.transitionTo(location);
            });
        });
    }
    set(router) {
        if (this.list.indexOf(router) > -1)
            return;
        this.list.push(router);
    }
    clear(router) {
        const index = this.list.indexOf(router);
        this.list.splice(index, 1);
    }
    dispatchTarget(target) {
        this.target = target;
        return this;
    }
    sync(fn) {
        if (this.syncing)
            return;
        this.syncing = true;
        this.list.forEach((router) => {
            if (this.target === router)
                return;
            fn(router);
        });
        this.target = null;
        this.syncing = false;
    }
    push(location) {
        this.sync((router) => {
            if (router.currentRoute.fullPath === location)
                return;
            vue_router_1.default.prototype.push.call(router, location);
        });
    }
    replace(location) {
        this.sync((router) => {
            if (router.currentRoute.fullPath === location)
                return;
            vue_router_1.default.prototype.replace.call(router, location);
        });
    }
}
GenesisAppRouter.key = '__genesisAppRouter';
const getRoute = () => {
    if (typeof window === 'object') {
        const win = window;
        if (!win[GenesisAppRouter.key]) {
            win[GenesisAppRouter.key] = new GenesisAppRouter();
        }
        return win[GenesisAppRouter.key];
    }
    return null;
};
const route = getRoute();
class Router extends vue_router_1.default {
    constructor(options = {}) {
        super({
            ...options,
            mode: options.mode === 'history' ? 'abstract' : options.mode
        });
        this._mode = 'abstract';
        this._mode = options.mode;
        if (!this._isSync)
            return;
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
    get _isSync() {
        return this._mode === 'history' && !!route;
    }
    get routeState() {
        return history.state || {};
    }
    async push(location) {
        return this.pushState(location, null);
    }
    async pushState(location, data) {
        const url = this.resolve(location).route.fullPath;
        if (url === this.currentRoute.fullPath)
            return this.currentRoute;
        const sync = (url) => {
            if (this._isSync) {
                route.dispatchTarget(this).push(url);
                history.pushState(data, '', url);
            }
        };
        const v = await super.push(location).catch((err) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (this.currentRoute.fullPath === url)
                        return reject(err);
                    return resolve(this.currentRoute);
                });
            });
        });
        sync(v.fullPath);
        return v;
    }
    replace(location) {
        return this.replaceState(location, null);
    }
    async replaceState(location, data) {
        const url = this.resolve(location).route.fullPath;
        const sync = (url) => {
            if (this._isSync) {
                route.dispatchTarget(this).replace(url);
                history.replaceState(data, '', url);
            }
        };
        const v = await super.replace(location).catch((err) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (this.currentRoute.fullPath === url)
                        return reject(err);
                    return resolve(this.currentRoute);
                });
            });
        });
        sync(v.fullPath);
        return v;
    }
    go(n) {
        if (this._isSync) {
            return history.go(n);
        }
        return super.go(n);
    }
    back() {
        if (this._isSync) {
            return history.back();
        }
        return super.back();
    }
    forward() {
        if (this._isSync) {
            return history.forward();
        }
        return super.forward();
    }
}
exports.Router = Router;
