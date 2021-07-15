import Vue from 'vue';
import VueRouter, { RouterOptions, RawLocation } from 'vue-router';
import { sync, catchError } from './sync';

Vue.use(VueRouter);

function createOptions(options: RouterOptions = {}) {
    const temp: RouterOptions = { ...options };
    if (temp.scrollBehavior) {
        throw TypeError('Not supported in multi routing mode');
    }
    temp.sourceMode = options.mode;
    if (options.mode === 'history') {
        temp.mode = 'abstract';
    }
    return temp;
}

function needSync(router: VueRouter) {
    return router.options.sourceMode === 'history' && !!router.app;
}

export class Router extends VueRouter {
    public constructor(options: RouterOptions = {}) {
        super(createOptions(options));
        let app = this.app;
        Object.defineProperty(this, 'app', {
            set(v) {
                v ? sync.add(this) : sync.del(this);
                app = v;
            },
            get() {
                return app;
            }
        });
    }
    public get state() {
        return history.state || null;
    }
    public push(location: RawLocation) {
        if (needSync(this)) {
            if (location.replace) {
                return this.replace(location);
            }
            return this.pushState(location, null).catch(catchError.bind(this));
        }
        return super.push(location);
    }
    public pushState(location: RawLocation, state: any) {
        return (
            sync.toHistory(location, this, state) ||
            Promise.resolve(this.currentRoute)
        );
    }
    public replace(location: RawLocation) {
        if (needSync(this)) {
            return this.pushState(location, null).catch(catchError.bind(this));
        }
        return super.push(location);
    }
    public replaceState(location: RawLocation, state: any) {
        return (
            sync.toHistory(location, this, state, true) ||
            Promise.resolve(this.currentRoute)
        );
    }

    public go(n: number) {
        if (needSync(this)) {
            return history.go(n);
        }
        return super.go(n);
    }

    public back() {
        if (needSync(this)) {
            return history.back();
        }
        return super.back();
    }

    public forward() {
        if (needSync(this)) {
            return history.forward();
        }
        return super.forward();
    }
}

declare module 'vue-router/types/router' {
    interface VueRouter {
        state: any;
        // eslint-disable-next-line @typescript-eslint/method-signature-style
        pushState(location: RawLocation, data: any): Promise<Route>;
        // eslint-disable-next-line @typescript-eslint/method-signature-style
        replaceState(location: RawLocation, data: any): Promise<Route>;
    }
    interface RouterOptions {
        sourceMode?: RouterMode;
    }
}
