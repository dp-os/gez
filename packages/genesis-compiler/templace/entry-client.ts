import Vue from 'vue';
interface InstalledOptions {
    el: HTMLElement;
    id: string;
    name: string;
    state: { [x: string]: any };
    url: string;
}
interface InstalledListItem {
    appId: number;
    app: Promise<Vue>;
    options: InstalledOptions;
}

class Genesis {
    private applicationCenter = {};
    private installedList: InstalledListItem[] = [];
    private appId = 0;
    public constructor() {
        (window as any).genesis = this;
    }

    public register(name: string, fn: Function) {
        if (typeof name !== 'string') {
            throw new Error(`Application name must be of string type`);
        }
        if (typeof fn !== 'function') {
            throw new Error(
                `Application initialization method must be of string type`
            );
        }
        if (this.applicationCenter[name]) {
            throw new Error(
                `${name} Application has been used, please change the name`
            );
        }
        this.applicationCenter[name] = fn;
        this.startInstall();
    }

    /**
     * options.el html节点
     * options.id 当前应用的唯一id
     * options.name 当前应用的名称
     * options.state 当前应用的状态
     * options.url 当前应用的url
     */
    public install(options: any): number {
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
        const index = -1;
        const arr = this.installedList;
        // eslint-disable-next-line
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item.appId === appId) {
                const item = arr.splice(index, 1)[0];
                const app = await item.app;
                app && app.$destroy();
            }
        }
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
        });
    }
}

const genesis: Genesis = (window as any).genesis || new Genesis();

const start = (createApp?: Function) => {
    const name = process.env.GENESIS_NAME!;
    genesis.register(name, createApp);

    const nodeList = document.querySelectorAll(
        '[data-ssr-genesis-name="' + name + '"]'
    )!;
    const list: Element[] = Array.prototype.slice.call(nodeList);

    list.forEach((script) => {
        const id = script.getAttribute('data-ssr-genesis-id');
        if (!id) return;
        const el = document.querySelector(
            '[data-ssr-genesis-id="' + id + '"][data-server-rendered]'
        );
        if (!el) return;
        const data = window[id];
        delete window[id];
        genesis.install({
            ...data,
            el
        });
    });
};
start(require('${{clientFilename}}').default);
