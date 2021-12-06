"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteView = exports.loadScript = exports.loadStyle = void 0;
const vue_1 = __importDefault(require("vue"));
const format_1 = require("./format");
const remoteViewStateKey = '__remote_view_state__';
const isPromise = (obj) => {
    return (!!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function');
};
/**
 * el 加载的元素
 * bool 在 doc 中是否已经存在
 */
const onload = (el, bool) => {
    // 暂时先处理成已经加载成功
    if (bool === true && !('_loading' in el)) {
        return Promise.resolve(true);
    }
    // 已经加载成功
    if (el._loading === false) {
        return Promise.resolve(true);
    }
    // 正在加载中
    if (el._loading === true) {
        return new Promise((resolve) => {
            el._loadArr.push(resolve);
            el._loadArr = [];
        });
    }
    // 首次加载
    return new Promise((resolve, reject) => {
        const load = () => {
            el._loadArr.forEach((fn) => fn());
            el._loading = false;
            resolve(true);
        };
        const error = () => {
            el._loadArr.forEach((fn) => fn());
            el._loading = false;
            resolve(false);
        };
        el.addEventListener('load', load, false);
        el.addEventListener('error', error, false);
        el._loading = true;
        el._loadArr = [];
    });
};
/**
 * 加载样式文件
 */
const loadStyle = (html) => {
    const doc = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = html;
    const arr = [];
    const linkArr = document.querySelectorAll('link[rel=stylesheet][href]');
    const findOne = (href) => {
        for (let i = 0; i < linkArr.length; i++) {
            if (linkArr[i].href === href) {
                return linkArr[i];
            }
        }
        return null;
    };
    const installArr = [];
    const forEach = (el) => {
        if (el instanceof HTMLLinkElement &&
            el.rel === 'stylesheet' &&
            el.href) {
            const docLink = findOne(el.href);
            if (docLink) {
                arr.push(onload(docLink, true));
                return;
            }
            else {
                arr.push(onload(el, false));
            }
        }
        installArr.push(el);
    };
    for (let i = 0; i < div.children.length; i++) {
        forEach(div.children[i]);
    }
    installArr.forEach((el) => {
        doc.appendChild(el);
    });
    document.head.appendChild(doc);
    return Promise.all(arr);
};
exports.loadStyle = loadStyle;
/**
 * 加载js文件
 */
const loadScript = (html) => {
    const doc = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = html;
    const arr = [];
    const scriptArr = document.querySelectorAll('script[src]');
    const findOne = (src) => {
        for (let i = 0; i < scriptArr.length; i++) {
            if (scriptArr[i].src === src) {
                return scriptArr[i];
            }
        }
        return null;
    };
    const installArr = [];
    const forEach = (el) => {
        if (el instanceof HTMLScriptElement) {
            if (el.src) {
                const docLink = findOne(el.src);
                if (docLink) {
                    arr.push(onload(docLink, true));
                    return;
                }
                else {
                    const newScript = document.createElement('script');
                    const attrs = Object.values(el.attributes);
                    newScript.async = false;
                    attrs.forEach((attr) => {
                        const value = el.getAttribute(attr.name);
                        newScript.setAttribute(attr.name, value);
                    });
                    newScript.src = el.src;
                    arr.push(onload(newScript, false));
                    installArr.push(newScript);
                    return;
                }
            }
            else if (el.innerHTML) {
                // eslint-disable-next-line no-new-func
                const run = new Function(el.innerHTML);
                run();
            }
        }
        installArr.push(el);
    };
    for (let i = 0; i < div.children.length; i++) {
        forEach(div.children[i]);
    }
    installArr.forEach((el) => {
        doc.appendChild(el);
    });
    document.body.appendChild(doc);
    return Promise.all(arr);
};
exports.loadScript = loadScript;
/**
 * 远程调用组件
 */
exports.RemoteView = {
    name: 'remote-view',
    props: {
        tagName: {
            type: String,
            default: 'div'
        },
        fetch: {
            type: Function
        },
        clientFetch: {
            type: Function
        },
        serverFetch: {
            type: Function
        }
    },
    data() {
        return {
            // 安装的选项
            installOptions: {},
            // 远程请求到的数据
            localData: {
                style: '',
                script: '',
                html: ''
            },
            // 组件渲染的下标
            index: 0,
            // 应用安装的id
            appId: 0,
            // 当前组件是否已销毁
            destroyed: false,
            // 是否需要客户端加载远程组件
            needClientLoad: true
        };
    },
    created() {
        if (process.env.VUE_ENV === 'client') {
            if (!this.$root.$options.clientOptions)
                return;
            this.initClient();
        }
        if (process.env.VUE_ENV === 'server') {
            if (!this.$root.$options.renderContext)
                return;
            this.initServer();
        }
    },
    render(h) {
        return h(this.tagName, {
            domProps: {
                innerHTML: this.localData.html
            }
        });
    },
    mounted() {
        if (this.needClientLoad) {
            this.clientLoad();
        }
        else {
            this.$nextTick(this.install);
        }
    },
    beforeDestroy() {
        if (this.appId) {
            window.genesis.uninstall(this.appId);
        }
        this.destroyed = true;
    },
    methods: {
        _fetch() {
            try {
                let fetch = this.fetch;
                if (process.env.VUE_ENV === 'server' &&
                    typeof this.serverFetch === 'function') {
                    fetch = this.serverFetch;
                }
                if (process.env.VUE_ENV === 'client' &&
                    typeof this.clientFetch === 'function') {
                    fetch = this.clientFetch;
                }
                if (typeof fetch !== 'function') {
                    return Promise.resolve(null);
                }
                const res = fetch();
                if (isPromise(res)) {
                    return res
                        .then((data) => {
                        if (typeof data !== 'object')
                            return null;
                        return data;
                    })
                        .catch((e) => {
                        console.error('[remote-view] Error calling fetch', e);
                        return null;
                    });
                }
                return Promise.resolve(null);
            }
            catch (e) {
                console.error('[remote-view] Error calling fetch', e);
                return Promise.resolve(null);
            }
        },
        install() {
            this.$nextTick(() => {
                const options = {
                    ...this.installOptions,
                    mounted: (app) => {
                        Object.keys(this.$listeners).forEach((name) => {
                            app.$on(name, this.$listeners[name]);
                        });
                        this.$emit('mounted');
                    }
                };
                if (!this.$el.firstChild)
                    return;
                Object.defineProperty(options, 'el', {
                    enumerable: false,
                    value: this.$el.firstChild
                });
                if (options.el && window.genesis && !this.destroyed) {
                    this.$emit('beforeInstall', options);
                    this.appId = window.genesis.install(options);
                }
            });
        },
        initServer() {
            const context = this.$root.$options.renderContext;
            const state = context.data.state;
            const first = !state[remoteViewStateKey];
            state[remoteViewStateKey] = state[remoteViewStateKey] || [];
            this.index = state[remoteViewStateKey].length;
            state[remoteViewStateKey].push(this.localData);
            Object.defineProperty(this.localData, 'style', {
                enumerable: false
            });
            Object.defineProperty(this.localData, 'script', {
                enumerable: false
            });
            Object.defineProperty(this.localData, 'html', {
                enumerable: false
            });
            if (!first)
                return;
            /**
             * 渲染完成后，对js和样式进行去重
             */
            context.beforeRender(format_1.beforeRender);
        },
        initClient() {
            const clientOptions = this.$root.$options
                .clientOptions;
            const state = clientOptions.state;
            // 热更新可能会不存在数组，或者数组已经被清空了。
            if (!state[remoteViewStateKey] || !state[remoteViewStateKey].length)
                return;
            const data = state[remoteViewStateKey].splice(0, 1)[0];
            // 这里服务器端加载失败，要调整到客户端加载
            if (!data.id)
                return;
            const el = document.querySelector(`[data-ssr-genesis-id="${data.id}"]`);
            if (!el)
                return;
            this.localData.html = el.parentNode.innerHTML;
            this.installOptions = { ...data };
            // 服务器端已经加载，客户端不需要再重新加载
            this.needClientLoad = false;
        },
        clientLoad() {
            const haveFlase = (arr) => {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === false) {
                        return true;
                    }
                }
                return false;
            };
            return this._fetch().then((data) => {
                if (data === null)
                    return;
                Promise.all([
                    (0, exports.loadStyle)(data.style).then((arr) => {
                        this.localData = { ...data };
                        return !haveFlase(arr);
                    }),
                    (0, exports.loadScript)(data.script).then((arr) => {
                        window[data.id] = data.state;
                        return !haveFlase(arr);
                    })
                ]).then((arr) => {
                    this.installOptions = { ...data };
                    this.install();
                    if (haveFlase(arr)) {
                        this.$emit('error');
                    }
                });
            });
        }
    },
    serverPrefetch() {
        return this._fetch().then((data) => {
            if (data === null)
                return;
            const context = this.$root.$options.renderContext;
            if (!context && typeof context !== 'object') {
                throw new TypeError('[remote-view] Need to pass context to the root instance of vue');
            }
            data.automount = false;
            Object.assign(this.localData, data);
        });
    }
};
exports.default = {
    install(_Vue) {
        _Vue.component('remote-view', vue_1.default.extend(exports.RemoteView));
    }
};
