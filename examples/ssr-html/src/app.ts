import * as images from './images';

export interface AppOptions {
    state: Record<string, any>;
}

export class App {
    public options: AppOptions;
    public time = new Date().toISOString();
    public constructor(options: AppOptions) {
        this.options = options;
    }
    public render() {
        const { state } = this.options;
        const { time } = this;
        return `
    <h1>Gez</h1>
    <p>你好世界！</p>
    <h2>模拟客户端水合</h2>
    <time>${time}</time>
    <h2>请求参数</h2>
    <pre>${JSON.stringify(state, null, 4)}</pre>
    <h2>图片</h2>
    <ul>
        <li>${images.svg} <br>
            <img height="100" src="${images.svg}">
        </li>
        <li>${images.jpg} <br>
            <img height="100" src="${images.jpg}">
        </li>
        <li>${images.cat} <br>
            <img height="100" src="${images.cat}">
        </li>
        <li>${images.loading} <br>
            <img height="100" src="${images.loading}">
        </li>
        <li>${images.sun} <br>
            <img height="100" src="${images.sun}">
        </li>
    </ul>
`;
    }
    public mount(selector: string) {
        const el = document.querySelector(selector);
        if (!el) return;
        el.innerHTML = this.render();
        setInterval(() => {
            this.time = new Date().toISOString();
            el.innerHTML = this.render();
        }, 1000);
    }
}
