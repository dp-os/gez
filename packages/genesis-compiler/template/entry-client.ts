import './webpack-public-path-client';

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
        if (typeof name !== 'string') {
            throw new Error(`Application name must be of string type`);
        }
        if (typeof createApp !== 'function') {
            throw new Error(
                `Application initialization method must be of string type`
            );
        }
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
        if (typeof options !== 'object') {
            throw new TypeError('Options must be the object type');
        }
        if (!(options.el instanceof HTMLElement)) {
            throw new TypeError('Options.el must be the HTMLElement');
        }
        if (typeof options.id !== 'string') {
            throw new TypeError('Options.id must be the string type');
        }
        if (typeof options.name !== 'string') {
            throw new TypeError('Options.name must be the string type');
        }
        if (typeof options.state !== 'object') {
            throw new TypeError('Options.state must be the object type');
        }
        if (typeof options.url !== 'string') {
            throw new TypeError('Options.url must be the string type');
        }
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
            app.$mount(item.options.el);
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
        if (data.automount === false) return;

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

start(require('${{clientFilename}}').default);

declare global {
    interface Window {
        genesis: Genesis;
    }
}
