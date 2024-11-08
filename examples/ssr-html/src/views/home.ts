import { layout } from 'ssr-html/src/components/layout';
import * as images from 'ssr-html/src/images';
import { Page } from 'ssr-html/src/page';

export default class Home extends Page {
    public constructor(imports: ImportMeta[]) {
        imports.push(import.meta);
        super(imports);
    }
    public state = {
        count: 0
    };
    public render(): string {
        const { url } = this.props;
        const { count } = this.state;
        return layout(`
        <h2>计数器</h2>
        <div id="count">${count}</div>
        <h2>请求地址</h2>
        <pre>${url}</pre>
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
`);
    }
    public onClient() {
        setInterval(() => {
            this.state.count++;
            const countEl = document.querySelector('#count');
            if (countEl instanceof HTMLDivElement) {
                countEl.innerText = String(this.state.count);
            }
        }, 1000);
    }
    /**
     * 模拟服务端请求数据
     */
    public async onServer() {
        this.state.count = 1;
    }
}
