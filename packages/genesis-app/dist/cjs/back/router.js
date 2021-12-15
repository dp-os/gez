"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const vue_1 = __importDefault(require("vue"));
const vue_router_1 = __importDefault(require("vue-router"));
const sync_1 = require("./sync");
vue_1.default.use(vue_router_1.default);
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
class Router extends vue_router_1.default {
    constructor(options = {}) {
        super(createOptions(options));
        let app = this.app;
        Object.defineProperty(this, 'app', {
            set(v) {
                v ? sync_1.sync.add(this) : sync_1.sync.del(this);
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
            return this.pushState(location, null).catch(sync_1.catchError.bind(this));
        }
        return super.push(location);
    }
    pushState(location, state) {
        return (sync_1.sync.toHistory(location, this, state) ||
            Promise.resolve(this.currentRoute));
    }
    replace(location) {
        if (needSync(this)) {
            return this.pushState(location, null).catch(sync_1.catchError.bind(this));
        }
        return super.push(location);
    }
    replaceState(location, state) {
        return (sync_1.sync.toHistory(location, this, state, true) ||
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
exports.Router = Router;
