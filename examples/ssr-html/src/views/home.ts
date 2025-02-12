import { layout } from 'ssr-html/src/components/layout';
import * as images from 'ssr-html/src/images';
import { Page } from 'ssr-html/src/page';
import { title } from 'ssr-html/src/title';

export default class Home extends Page {
    public state = {
        count: 0
    };
    public title = title.home;
    public render(): string {
        const { url } = this.props;
        const { count } = this.state;
        return layout(
            `
        <div class="counter">
            <h2>计数器</h2>
            <div id="count" class="counter-value">${count}</div>
        </div>

        <div class="url-section">
            <h2>请求地址</h2>
            <pre>${url}</pre>
        </div>

        <section>
            <h2>图片展示</h2>
            <ul class="image-grid">
                <li>
                    <img src="${images.svg}" alt="SVG示例" width="100" height="60">
                </li>
                <li>
                    <img src="${images.jpg}" alt="JPG示例" width="1024" height="768">
                </li>
                <li>
                    <img src="${images.cat}" alt="猫咪图片" width="769" height="225">
                </li>
                <li>
                    <img src="${images.loading}" alt="加载动画" width="123" height="123">
                </li>
                <li>
                    <img src="${images.sun}" alt="太阳图标" width="351" height="300">
                </li>
            </ul>
        </section>
`,
            { url }
        );
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
        this.importMetaSet.add(import.meta);
        super.onServer();
        this.state.count = 1;
    }
}
