"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var clientKey = '__remote_view_client_state__';
var serverKey = '__remote_view_server_state__';
var RemoteView = /** @class */ (function () {
    function RemoteView() {
    }
    RemoteView.install = function (_Vue, options) {
        var RemoteView = _Vue.extend({
            name: 'remote-view',
            props: {
                method: String,
                url: String,
                option: Object,
                mode: String,
                serverCall: Boolean
            },
            data: function () {
                return {
                    installOptions: {},
                    html: '',
                    remote: {},
                    serverIndex: 0,
                    appId: 0,
                    destroyed: false
                };
            },
            created: function () {
                var ssrContext = this.$root.$options.ssrContext;
                if (!ssrContext) {
                    return;
                }
                if (typeof window === 'object') {
                    this.initClient();
                }
                else {
                    this.initServer();
                }
            },
            render: function (h) {
                return h('div', {
                    domProps: {
                        innerHTML: this.html
                    }
                });
            },
            mounted: function () {
                var ssrContext = this.$root.$options.ssrContext;
                if (!ssrContext) {
                    this.clientLoad();
                }
                else {
                    this.install();
                }
            },
            beforeDestroy: function () {
                if (this.appId) {
                    window.genesis.uninstall(this.appId);
                }
                this.destroyed = true;
            },
            methods: {
                install: function () {
                    var _this = this;
                    this.$nextTick(function () {
                        var options = __assign(__assign({}, _this.installOptions), { el: _this.$el.firstChild });
                        if (options.el &&
                            window.genesis &&
                            !_this.destroyed) {
                            _this.appId = window.genesis.install(options);
                        }
                    });
                },
                initServer: function () {
                    var ssrContext = this.$root.$options.ssrContext;
                    var state = ssrContext.data.state;
                    state[clientKey] = state[clientKey] || [];
                    state[serverKey] = state[serverKey] || [];
                    this.serverIndex = state[clientKey].length;
                    state[serverKey].push(this.remote);
                    state[clientKey].push(null);
                    Object.defineProperty(state, serverKey, {
                        enumerable: false
                    });
                },
                initClient: function () {
                    var ssrContext = this.$root.$options.ssrContext;
                    var id = ssrContext.state[clientKey].splice(0, 1)[0];
                    if (!id) {
                        // 这里服务器端加载失败，要调整到客户端加载
                        this.clientLoad();
                        return;
                    }
                    var el = document.querySelector("[data-ssr-genesis-id=\"" + id + "\"][data-server-rendered]");
                    if (!el)
                        return;
                    this.html = el.parentNode.innerHTML;
                    if (!window[id]) {
                        throw new Error("Context for " + id + " not found");
                    }
                    this.installOptions = window[id];
                    delete window[id];
                },
                clientLoad: function () {
                    var _this = this;
                    axios_1.default.get(this.url).then(function (res) {
                        if (res.status !== 200)
                            return;
                        return _this.$nextTick().then(function () {
                            // 这里需要往页面插入样式和js
                            var temp = document.createElement('div');
                            temp.innerHTML = res.data.style;
                            var nodeListToArr = function (nodes) {
                                var arr = [];
                                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                                for (var i = 0; i < nodes.length; i++) {
                                    arr.push(nodes[i]);
                                }
                                return arr;
                            };
                            var stylePromiseArr = [];
                            var scriptPromiseArr = [];
                            var styles = nodeListToArr(temp.childNodes).map(function (style) {
                                if (!(style instanceof HTMLLinkElement) ||
                                    !style.href)
                                    return style;
                                var attrs = style.getAttributeNames();
                                var values = [];
                                attrs.forEach(function (attr) {
                                    var value = style.getAttribute(attr);
                                    values.push("[" + attr + "=\"" + value + "\"]");
                                });
                                var existEl = document.querySelector("link" + values.join(''));
                                // 已经存在
                                if (existEl) {
                                    // 已经加载完成了
                                    if (!existEl.onload)
                                        return null;
                                    var ready_1;
                                    stylePromiseArr.push(new Promise(function (resolve) {
                                        ready_1 = resolve;
                                    }));
                                    var done_1 = function () {
                                        existEl.removeEventListener('load', done_1, false);
                                        existEl.removeEventListener('error', done_1, false);
                                        ready_1();
                                    };
                                    existEl.addEventListener('load', done_1, false);
                                    existEl.addEventListener('error', done_1, false);
                                    return null;
                                }
                                // 首次加载这个样式文件
                                var ready;
                                stylePromiseArr.push(new Promise(function (resolve) {
                                    ready = resolve;
                                }));
                                var done = function () {
                                    style.onload = null;
                                    style.onerror = null;
                                    console.log('genesis-remote style', style.href);
                                    ready();
                                };
                                style.onload = done;
                                style.onerror = done;
                                return style;
                            });
                            temp.innerHTML =
                                res.data.script + res.data.scriptState;
                            var scripts = nodeListToArr(temp.childNodes).map(function (script) {
                                var attrs = script.getAttributeNames();
                                var values = [];
                                attrs.forEach(function (attr) {
                                    var value = script.getAttribute(attr);
                                    values.push("[" + attr + "=\"" + value + "\"]");
                                });
                                var existEl = document.querySelector("script" + values.join(''));
                                // 已经存在
                                if (existEl) {
                                    // 已经加载完成了
                                    if (!existEl.onload)
                                        return null;
                                    var ready_2;
                                    scriptPromiseArr.push(new Promise(function (resolve) {
                                        ready_2 = resolve;
                                    }));
                                    var done_2 = function () {
                                        existEl.removeEventListener('load', done_2, false);
                                        existEl.removeEventListener('error', done_2, false);
                                        ready_2();
                                    };
                                    existEl.addEventListener('load', done_2, false);
                                    existEl.addEventListener('error', done_2, false);
                                    return null;
                                }
                                // 首次加载这个js文件
                                var newScript = document.createElement('script');
                                newScript.async = false;
                                attrs.forEach(function (attr) {
                                    var value = script.getAttribute(attr);
                                    newScript.setAttribute(attr, value);
                                });
                                if (script.innerHTML &&
                                    !script.getAttribute('src')) {
                                    // eslint-disable-next-line no-new-func
                                    new Function(script.innerHTML)();
                                    if (window[res.data.id]) {
                                        window[res.data.id].automount = false;
                                    }
                                }
                                if (!script.src)
                                    return script;
                                var ready;
                                scriptPromiseArr.push(new Promise(function (resolve) {
                                    ready = resolve;
                                }));
                                var done = function () {
                                    newScript.onload = null;
                                    newScript.onerror = null;
                                    console.log('genesis-remote script', newScript.src);
                                    ready();
                                };
                                newScript.onload = done;
                                newScript.onerror = done;
                                return newScript;
                            });
                            var doc = document.createDocumentFragment();
                            [].concat(styles, scripts).forEach(function (el) {
                                if (!el)
                                    return;
                                doc.appendChild(el);
                            });
                            document.body.appendChild(doc);
                            return Promise.all([
                                Promise.all(stylePromiseArr).then(function () {
                                    _this.html = res.data.html;
                                }),
                                Promise.all(scriptPromiseArr)
                            ]).then(function () {
                                var el = _this.$el.querySelector('[data-ssr-genesis-id="' +
                                    res.data.id +
                                    '"][data-server-rendered]');
                                if (!el)
                                    return;
                                _this.installOptions = {
                                    id: res.data.id,
                                    name: res.data.name,
                                    state: res.data.state,
                                    url: res.data.url
                                };
                                _this.install();
                            });
                        });
                    });
                }
            },
            serverPrefetch: function () {
                var _this = this;
                if (this.serverCall === false)
                    return;
                return axios_1.default.get(this.url).then(function (res) {
                    var ssrContext = _this.$root.$options.ssrContext;
                    if (ssrContext && res.status === 200) {
                        _this.html = res.data.html;
                        res.data.automount = false;
                        Object.assign(_this.remote, res.data);
                        ssrContext.data.state[clientKey][_this.serverIndex] =
                            res.data.id;
                    }
                });
            }
        });
        _Vue.component('remote-view', RemoteView);
    };
    return RemoteView;
}());
exports.default = RemoteView;
