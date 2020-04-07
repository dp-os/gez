import Vue from 'vue';
import axios from 'axios';
const clientKey = '__remote_view_client_state__';
const serverKey = '__remote_view_server_state__';

export default class RemoteView {
    public static install<T>(_Vue: typeof Vue, options?: T): void {
        const RemoteView = _Vue.extend({
            name: 'remote-view',
            props: {
                method: String,
                url: String,
                option: Object,
                mode: String,
                serverCall: Boolean
            },
            data() {
                return {
                    installOptions: {},
                    html: '',
                    remote: {},
                    serverIndex: 0
                };
            },
            created() {
                const ssrContext: any = this.$root.$options.ssrContext;
                if (!ssrContext) {
                    return;
                }
                if (typeof window === 'object') {
                    this.initClient();
                } else {
                    this.initServer();
                }
            },
            render(h) {
                return h('div', {
                    domProps: {
                        innerHTML: this.html
                    }
                });
            },
            mounted() {
                const ssrContext: any = this.$root.$options.ssrContext;
                if (!ssrContext) {
                    this.clientLoad();
                }
                this.install();
            },
            methods: {
                install() {
                    this.$nextTick(() => {
                        const options = {
                            ...this.installOptions,
                            el: this.$el.firstChild
                        };
                        if (options.el && (window as any).genesis) {
                            (window as any).genesis.install(options);
                        }
                    });
                },
                initServer() {
                    const ssrContext: any = this.$root.$options.ssrContext;
                    const state = ssrContext.data.state;

                    state[clientKey] = state[clientKey] || [];
                    state[serverKey] = state[serverKey] || [];

                    this.serverIndex = state[clientKey].length;

                    state[serverKey].push(this.remote);
                    state[clientKey].push(null);

                    Object.defineProperty(state, serverKey, {
                        enumerable: false
                    });
                },
                initClient() {
                    const ssrContext: any = this.$root.$options.ssrContext;
                    const id = ssrContext.state[clientKey].splice(0, 1)[0];
                    if (!id) {
                        // 这里服务器端加载失败，要调整到客户端加载
                        this.clientLoad();
                        return;
                    }
                    const el: any = document.querySelector(
                        `[data-ssr-genesis-id="${id}"][data-server-rendered]`
                    );
                    if (!el) return;
                    this.html = el.parentNode.innerHTML;
                    if (!window[id]) {
                        throw new Error(`Context for ${id} not found`);
                    }
                    this.installOptions = window[id];
                    delete window[id];
                },
                clientLoad() {
                    axios.get(this.url).then((res) => {
                        if (res.status !== 200) return;

                        return this.$nextTick().then(() => {
                            // 这里需要往页面插入样式和js
                            const temp = document.createElement('div');
                            temp.innerHTML = res.data.style;
                            const nodeListToArr = (nodes: any) => {
                                const arr: any[] = [];
                                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                                for (let i = 0; i < nodes.length; i++) {
                                    arr.push(nodes[i]);
                                }
                                return arr;
                            };
                            const stylePromiseArr: Promise<any>[] = [];
                            const scriptPromiseArr: Promise<any>[] = [];
                            const styles = nodeListToArr(temp.childNodes).map(
                                (style: HTMLStyleElement | HTMLLinkElement) => {
                                    if (
                                        !(style instanceof HTMLLinkElement) ||
                                        !style.href
                                    )
                                        return style;

                                    const attrs = style.getAttributeNames();
                                    const values: string[] = [];
                                    attrs.forEach((attr) => {
                                        const value = style.getAttribute(attr)!;
                                        values.push(`[${attr}="${value}"]`);
                                    });
                                    const existEl = document.querySelector(
                                        `link${values.join('')}`
                                    ) as HTMLLinkElement | null;
                                    // 已经存在
                                    if (existEl) {
                                        // 已经加载完成了
                                        if (!existEl.onload) return null;
                                        let ready;
                                        stylePromiseArr.push(
                                            new Promise((resolve) => {
                                                ready = resolve;
                                            })
                                        );
                                        const done = () => {
                                            existEl.removeEventListener(
                                                'load',
                                                done,
                                                false
                                            );
                                            existEl.removeEventListener(
                                                'error',
                                                done,
                                                false
                                            );
                                            ready();
                                        };
                                        existEl.addEventListener(
                                            'load',
                                            done,
                                            false
                                        );
                                        existEl.addEventListener(
                                            'error',
                                            done,
                                            false
                                        );
                                        return null;
                                    }
                                    // 首次加载这个样式文件
                                    let ready;
                                    stylePromiseArr.push(
                                        new Promise((resolve) => {
                                            ready = resolve;
                                        })
                                    );
                                    const done = () => {
                                        style.onload = null;
                                        style.onerror = null;
                                        console.log(
                                            'genesis-remote style',
                                            style.href
                                        );
                                        ready();
                                    };
                                    style.onload = done;
                                    style.onerror = done;
                                    return style;
                                }
                            );

                            temp.innerHTML =
                                res.data.script + res.data.scriptState;

                            const scripts = nodeListToArr(temp.childNodes).map(
                                (script: HTMLScriptElement) => {
                                    const attrs = script.getAttributeNames();
                                    const values: string[] = [];
                                    attrs.forEach((attr) => {
                                        const value = script.getAttribute(
                                            attr
                                        )!;
                                        values.push(`[${attr}="${value}"]`);
                                    });
                                    const existEl = document.querySelector(
                                        `script${values.join('')}`
                                    ) as HTMLScriptElement | null;
                                    // 已经存在
                                    if (existEl) {
                                        // 已经加载完成了
                                        if (!existEl.onload) return null;
                                        let ready;
                                        scriptPromiseArr.push(
                                            new Promise((resolve) => {
                                                ready = resolve;
                                            })
                                        );
                                        const done = () => {
                                            existEl.removeEventListener(
                                                'load',
                                                done,
                                                false
                                            );
                                            existEl.removeEventListener(
                                                'error',
                                                done,
                                                false
                                            );
                                            ready();
                                        };
                                        existEl.addEventListener(
                                            'load',
                                            done,
                                            false
                                        );
                                        existEl.addEventListener(
                                            'error',
                                            done,
                                            false
                                        );
                                        return null;
                                    }
                                    // 首次加载这个js文件
                                    const newScript = document.createElement(
                                        'script'
                                    );
                                    newScript.async = false;
                                    attrs.forEach((attr) => {
                                        const value = script.getAttribute(
                                            attr
                                        )!;
                                        newScript.setAttribute(attr, value);
                                    });
                                    // eslint-disable-next-line no-new-func
                                    new Function(script.innerHTML)();
                                    if (!script.src) return script;
                                    let ready;
                                    scriptPromiseArr.push(
                                        new Promise((resolve) => {
                                            ready = resolve;
                                        })
                                    );
                                    const done = () => {
                                        newScript.onload = null;
                                        newScript.onerror = null;
                                        console.log(
                                            'genesis-remote script',
                                            newScript.src
                                        );
                                        ready();
                                    };
                                    newScript.onload = done;
                                    newScript.onerror = done;
                                    return newScript;
                                }
                            );
                            const doc = document.createDocumentFragment();
                            [].concat(styles, scripts).forEach((el) => {
                                if (!el) return;
                                doc.appendChild(el);
                            });
                            document.body.appendChild(doc);
                            return Promise.all([
                                Promise.all(stylePromiseArr).then(() => {
                                    this.html = res.data.html;
                                }),
                                Promise.all(scriptPromiseArr)
                            ]).then(() => {
                                const el = this.$el.querySelector(
                                    '[data-ssr-genesis-id="' +
                                        res.data.id +
                                        '"][data-server-rendered]'
                                );
                                if (!el) return;
                                this.installOptions = {
                                    id: res.data.id,
                                    name: res.data.name,
                                    state: res.data.state,
                                    url: res.data.url
                                };
                                this.install();
                            });
                        });
                    });
                }
            },
            serverPrefetch(this: any) {
                if (this.serverCall === false) return;
                return axios.get(this.url).then((res) => {
                    const ssrContext = this.$root.$options.ssrContext;
                    if (ssrContext && res.status === 200) {
                        this.html = res.data.html;
                        Object.assign(this.remote, res.data);
                        ssrContext.data.state[clientKey][this.serverIndex] =
                            res.data.id;
                    }
                });
            }
        });
        _Vue.component('remote-view', RemoteView);
    }
}
