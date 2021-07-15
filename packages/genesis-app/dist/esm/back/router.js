import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync, catchError } from './sync';
Vue.use(VueRouter);
function createOptions(options = {}) {
    const temp = { ...options };
    if (temp.scrollBehavior) {
        throw TypeError('Not supported in multi routing mode');
    }
    temp.sourceMode = options.mode;
    if (options.mode === 'history') {
        temp.mode = 'abstract';
    }
    return temp;
}
function needSync(router) {
    return router.options.sourceMode === 'history' && !!router.app;
}
export class Router extends VueRouter {
    constructor(options = {}) {
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
    get state() {
        return history.state || null;
    }
    push(location) {
        if (needSync(this)) {
            if (location.replace) {
                return this.replace(location);
            }
            return this.pushState(location, null).catch(catchError.bind(this));
        }
        return super.push(location);
    }
    pushState(location, state) {
        return (sync.toHistory(location, this, state) ||
            Promise.resolve(this.currentRoute));
    }
    replace(location) {
        if (needSync(this)) {
            return this.pushState(location, null).catch(catchError.bind(this));
        }
        return super.push(location);
    }
    replaceState(location, state) {
        return (sync.toHistory(location, this, state, true) ||
            Promise.resolve(this.currentRoute));
    }
    go(n) {
        if (needSync(this)) {
            return history.go(n);
        }
        return super.go(n);
    }
    back() {
        if (needSync(this)) {
            return history.back();
        }
        return super.back();
    }
    forward() {
        if (needSync(this)) {
            return history.forward();
        }
        return super.forward();
    }
}
