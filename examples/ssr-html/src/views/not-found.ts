import { layout } from '../components/layout';
import { Page } from '../page';
import { title } from '../title';

export default class NotFound extends Page {
    public title = title.notFound;

    public render(): string {
        const { url, base } = this.props;
        return layout(
            `<div class="not-found">
                <div class="not-found-content">
                    <div class="error-code">404</div>
                    <h1>页面未找到</h1>
                    <p>抱歉，您访问的页面不存在或已被移除</p>
                    <div class="actions">
                        <a href="${base}/" class="back-home">返回首页</a>
                        <button onclick="window.history.back()" class="go-back">返回上一页</button>
                    </div>
                </div>
            </div>`,
            { url, base }
        );
    }

    public async onServer() {
        this.importMetaSet.add(import.meta);
        super.onServer();
    }
}
