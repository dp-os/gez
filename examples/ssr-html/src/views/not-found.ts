import { layout } from 'ssr-html/src/components/layout';
import { Page } from 'ssr-html/src/page';
import { title } from '../title';

export default class NotFound extends Page {
    public title = title.notFound;
    public render(): string {
        const { url } = this.props;
        return layout(
            `
        <div class="not-found">
            <div class="error-code">404</div>
            <h2>页面未找到</h2>
            <p>抱歉，您访问的页面不存在或已被移除。</p>
            <p>您可以返回首页继续浏览其他内容。</p>
            <a href="{{__HTML_BASE__}}/" class="back-home">返回首页</a>
        </div>
        `,
            { url }
        );
    }
    public async onServer() {
        this.importMetaSet.add(import.meta);
        super.onServer();
    }
}
