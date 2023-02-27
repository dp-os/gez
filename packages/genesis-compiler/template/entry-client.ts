/* eslint-disable */
// @ts-nocheck
import './webpack-public-path';

import { ClientOptions } from '@fmfe/genesis-core';
import Vue from 'vue';
interface InstalledListItem {
    appId: number;
    app: Promise<Vue> | null;
    options: ClientOptions;
}

class Genesis {
    private applicationCenter = {};
    private installedList: InstalledListItem[] = [];
    private appId = 0;
    public constructor() {
        (window as any).genesis = this;
    }

    public register(
        name: string,
        createApp: (data: ClientOptions) => Promise<Vue>
    ) {
        this.applicationCenter[name] = createApp;
        this.startInstall();
    }

    /**
     * options.el html节点
     * options.id 当前应用的唯一id
     * options.name 当前应用的名称
     * options.state 当前应用的状态
     * options.url 当前应用的url
     */
    public install(options: ClientOptions): number {
        const appId = ++this.appId;
        this.installedList.push({
            appId,
            options,
            app: null
        });
        this.startInstall();
        return appId;
    }

    public async uninstall(appId: number) {
        const arr = this.installedList;
        const index = arr.findIndex((item) => {
            return item.appId === appId;
        });
        if (index === -1) return false;
        const item = arr.splice(index, 1)[0];
        const app = await item.app;
        app && app.$destroy();
        item.app = null;

        return true;
    }

    private startInstall() {
        this.installedList.forEach(async (item) => {
            const createApp = this.applicationCenter[item.options.name];
            if (item.app || !createApp) return;
            item.app = createApp(item.options);
            const app = await item.app;
            if (!app || typeof app.$destroy !== 'function') {
                throw TypeError(
                    `${process.env.GENESIS_NAME} 'entry-client.ts' must return Vue object instance, Example 'export default async () => new Vue({...})'`
                );
            }
            try {
                app.$mount(item.options.el);
            } catch (err) {
                if (typeof item.options.error === 'function') {
                    item.options.error(err);
                }
                throw err;
            }
            if (typeof item.options.mounted === 'function') {
                // @ts-ignore
                item.options.mounted(app);
            }
        });
    }
}
const genesis: Genesis = window.genesis || new Genesis();

const start = (createApp?: (data: ClientOptions) => Promise<Vue>) => {
    const name = process.env.GENESIS_NAME!;
    if (typeof createApp === 'function') {
        genesis.register(name, createApp);
    }
    const nodeList = document.querySelectorAll(
        'script[data-ssr-genesis-name="' + name + '"]'
    )!;
    const list: Element[] = Array.prototype.slice.call(nodeList);
    list.forEach((script) => {
        const id = script.getAttribute('data-ssr-genesis-id');
        if (!id) return;
        const el = document.querySelector('[data-ssr-genesis-id="' + id + '"]');
        if (!el) return;
        const data = window[id];
        if (data.autoMount === false) return;

        delete window[id];
        const options: ClientOptions = data;
        options.env = 'client';
        Object.defineProperty(options, 'el', {
            enumerable: false,
            value: el
        });
        genesis.install(options);
    });
};


function genesisLoadExposes(src: string, curName: string, remoteName: string, varName: string, resolve: Function, reject: Function) {
    if (window[varName]) {
        return resolve(window[varName]);
    }
    var queueKey = varName + "_queue";
    var isFirst = !window[queueKey];
    if (isFirst) {
        window[queueKey] = [];
    }
    var queue = window[queueKey];
    function complete(name: string, val: any) {
        queue.forEach(function (item) {
            item[name](val);
        });
        window[queueKey] = []
    }
    queue.unshift({
        resolve: resolve,
        reject: reject
    });
    if (isFirst) {
        if (!src) {
            var err = new Error(curName + " does not declare that " + remoteName + " is a remote dependency");
            complete("reject", err);
            return;
        }
        var script = document.createElement("script");
        script.src = src;
        script.onload = function onload() {
            var proxy = {
                get: function (...args: any[]) {
                    return window[varName].get(...args);
                },
                init: function (...args: any[]) {
                    try {
                        return window[varName].init(...args);
                    } catch (e) {
                        console.log('remote container already initialized');
                    }
                }
            };
            complete("resolve", proxy);
        };
        script.onerror = function onerror() {
            document.head.removeChild(script);
            var err = new Error("Load " + script.src + " failed");
            complete("reject", err);
        };
        document.head.appendChild(script);
    }
}

if (!window.__genesisLoadExposes__) {
    window.__genesisLoadExposes__ = genesisLoadExposes;
}
// eslint-disable-next-line
import('${{clientFilename}}').then((m) => start(m.default));

declare global {
    interface Window {
        genesis: Genesis;
    }
}
