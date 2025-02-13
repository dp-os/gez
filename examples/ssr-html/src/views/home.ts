import { layout } from 'ssr-html/src/components/layout';
import * as images from 'ssr-html/src/images';
import { Page } from 'ssr-html/src/page';
import { title } from 'ssr-html/src/title';

export default class Home extends Page {
    public state = {
        count: 0,
        time: ''
    };
    public title = title.home;
    public render(): string {
        const { url, base } = this.props;
        const { count } = this.state;
        return layout(
            `
        <section>
            <h2>计数器</h2>
            <div class="content-area counter">
                <div id="count" class="counter-value">${count}</div>
            </div>
        </section>

        <section>
            <h2>请求地址</h2>
            <div class="content-area url-section">
                <pre>${url}</pre>
            </div>
        </section>

        <section>
            <h2>图片展示</h2>
            <ul class="image-grid">
                <li>
                    <div class="image-wrapper">
                        <img src="${images.svg}" alt="SVG示例" width="200" height="200">
                    </div>
                    <div class="image-info">
                        <h3>SVG 示例</h3>
                        <p>类型：SVG</p>
                        <p>尺寸：200 x 200</p>
                    </div>
                </li>
                <li>
                    <div class="image-wrapper">
                        <img src="${images.jpg}" alt="JPG示例" width="1024" height="768">
                    </div>
                    <div class="image-info">
                        <h3>JPG 示例</h3>
                        <p>类型：JPG</p>
                        <p>尺寸：1024 x 768</p>
                    </div>
                </li>
                <li>
                    <div class="image-wrapper">
                        <img src="${images.cat}" alt="猫咪图片" width="769" height="225">
                    </div>
                    <div class="image-info">
                        <h3>猫咪图片</h3>
                        <p>类型：PNG</p>
                        <p>尺寸：769 x 225</p>
                    </div>
                </li>
                <li>
                    <div class="image-wrapper">
                        <img src="${images.runningDog}" alt="疯狂编码" width="480" height="297">
                    </div>
                    <div class="image-info">
                        <h3>疯狂编码</h3>
                        <p>类型：GIF</p>
                        <p>尺寸：480 x 297</p>
                    </div>
                </li>
                <li>
                    <div class="image-wrapper">
                        <img src="${images.sun}" alt="太阳图标" width="351" height="300">
                    </div>
                    <div class="image-info">
                        <h3>太阳图标</h3>
                        <p>类型：SVG</p>
                        <p>尺寸：351 x 300</p>
                    </div>
                </li>
            </ul>
        </section>

        <section class="update-section">
            <div class="update-info">
                <span>最后更新：${new Date(this.state.time).toLocaleString(
                    'zh-CN',
                    {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }
                )}</span>
            </div>
        </section>
`,
            {
                url: url,
                base: base
            }
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
        this.state.time = new Date().toISOString();
    }
}
