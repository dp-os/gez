"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.getLocation = void 0;
var vue_1 = __importDefault(require("vue"));
var vue_router_1 = __importDefault(require("vue-router"));
vue_1.default.use(vue_router_1.default);
function getLocation(base) {
    var path = decodeURI(window.location.pathname);
    if (base && path.indexOf(base) === 0) {
        path = path.slice(base.length);
    }
    return (path || '/') + window.location.search + window.location.hash;
}
exports.getLocation = getLocation;
var GenesisAppRouter = /** @class */ (function () {
    function GenesisAppRouter() {
        var _this = this;
        this.list = [];
        this.syncing = false;
        window.addEventListener('popstate', function (e) {
            _this.sync(function (router) {
                // Here is a Fang'f that vue-router does not disclose
                var location = getLocation(router.base);
                router.history.transitionTo(location);
            });
        });
    }
    GenesisAppRouter.prototype.set = function (router) {
        if (this.list.indexOf(router) > -1)
            return;
        this.list.push(router);
    };
    GenesisAppRouter.prototype.clear = function (router) {
        var index = this.list.indexOf(router);
        this.list.splice(index, 1);
    };
    GenesisAppRouter.prototype.dispatchTarget = function (target) {
        this.target = target;
        return this;
    };
    GenesisAppRouter.prototype.sync = function (fn) {
        var _this = this;
        if (this.syncing)
            return;
        this.syncing = true;
        this.list.forEach(function (router) {
            if (_this.target === router)
                return;
            fn(router);
        });
        this.target = null;
        this.syncing = false;
    };
    GenesisAppRouter.prototype.push = function (location) {
        this.sync(function (router) {
            if (router.currentRoute.fullPath === location)
                return;
            vue_router_1.default.prototype.push.call(router, location);
        });
    };
    GenesisAppRouter.prototype.replace = function (location) {
        this.sync(function (router) {
            if (router.currentRoute.fullPath === location)
                return;
            vue_router_1.default.prototype.replace.call(router, location);
        });
    };
    GenesisAppRouter.key = '__genesisAppRouter';
    return GenesisAppRouter;
}());
var getRoute = function () {
    if (typeof window === 'object') {
        var win = window;
        if (!win[GenesisAppRouter.key]) {
            win[GenesisAppRouter.key] = new GenesisAppRouter();
        }
        return win[GenesisAppRouter.key];
    }
    return null;
};
var route = getRoute();
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    function Router(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, __assign(__assign({}, options), { mode: options.mode === 'history' ? 'abstract' : options.mode })) || this;
        _this._mode = 'abstract';
        _this._mode = options.mode;
        if (!_this._isSync)
            return _this;
        route.set(_this);
        var app = _this.app;
        var remove = false;
        Object.defineProperty(_this, 'app', {
            set: function (v) {
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
            get: function () {
                return app;
            }
        });
        return _this;
    }
    Object.defineProperty(Router.prototype, "_isSync", {
        get: function () {
            return this._mode === 'history' && !!route;
        },
        enumerable: false,
        configurable: true
    });
    Router.prototype.push = function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var url, sync, v;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.resolve(location).route.fullPath;
                        if (url === this.currentRoute.fullPath)
                            return [2 /*return*/, this.currentRoute];
                        sync = function (url) {
                            if (_this._isSync) {
                                route.dispatchTarget(_this).push(url);
                                history.pushState({}, '', url);
                            }
                        };
                        return [4 /*yield*/, _super.prototype.push.call(this, location).catch(function (err) {
                                return new Promise(function (resolve, reject) {
                                    setTimeout(function () {
                                        if (_this.currentRoute.fullPath === url)
                                            return reject(err);
                                        return resolve(_this.currentRoute);
                                    });
                                });
                            })];
                    case 1:
                        v = _a.sent();
                        sync(v.fullPath);
                        return [2 /*return*/, v];
                }
            });
        });
    };
    Router.prototype.replace = function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var url, sync, v;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.resolve(location).route.fullPath;
                        sync = function (url) {
                            if (_this._isSync) {
                                route.dispatchTarget(_this).replace(url);
                                history.replaceState({}, '', url);
                            }
                        };
                        return [4 /*yield*/, _super.prototype.replace.call(this, location).catch(function (err) {
                                return new Promise(function (resolve, reject) {
                                    setTimeout(function () {
                                        if (_this.currentRoute.fullPath === url)
                                            return reject(err);
                                        return resolve(_this.currentRoute);
                                    });
                                });
                            })];
                    case 1:
                        v = _a.sent();
                        sync(v.fullPath);
                        return [2 /*return*/, v];
                }
            });
        });
    };
    Router.prototype.go = function (n) {
        if (this._isSync) {
            return history.go(n);
        }
        return _super.prototype.go.call(this, n);
    };
    Router.prototype.back = function () {
        if (this._isSync) {
            return history.back();
        }
        return _super.prototype.back.call(this);
    };
    Router.prototype.forward = function () {
        if (this._isSync) {
            return history.forward();
        }
        return _super.prototype.forward.call(this);
    };
    return Router;
}(vue_router_1.default));
exports.Router = Router;
