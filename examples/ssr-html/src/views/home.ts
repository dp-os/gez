import { layout } from 'ssr-html/src/components/layout';
import * as images from 'ssr-html/src/images';
import { Page } from 'ssr-html/src/page';

export default class Home extends Page {
    public state = {
        time: ''
    };
    public render(): string {
        const { url } = this.props;
        const { time } = this.state;
        return layout(`
        <h2>模拟客户端水合</h2>
        <time>${time}</time>
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
    /**
     * 模拟服务端请求数据
     */
    public async onServer() {
        this.state.time = new Date().toISOString();
    }
}
