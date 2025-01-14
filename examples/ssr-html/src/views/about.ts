import { layout } from 'ssr-html/src/components/layout';
import { Page } from 'ssr-html/src/page';
import { title } from '../title';

export default class Home extends Page {
    public state = {
        time: ''
    };
    public title = title.about;
    public render(): string {
        return layout(
            `Gez 是一个基于 Rspack 构建的模块链接（Module Link） 解决方案，通过 importmap 将多服务的模块映射到具有强缓存，基于内容哈希的 URL 中。`
        );
    }
    /**
     * 模拟服务端请求数据
     */
    public async onServer() {
        this.importMetaSet.add(import.meta);
        super.onServer();
        this.state.time = new Date().toISOString();
    }
}
