export interface PageProps {
    url: string;
}

export class Page {
    public props: PageProps;
    /**
     * 自定义页面状态
     */
    public state: Record<string, any> = {};
    public constructor(props: PageProps) {
        this.props = props;
    }
    /**
     * 服务端渲染生成的 HTML
     */
    public render() {
        return ``;
    }
    /**
     * 客户端执行
     */
    public onClient() {}
    /**
     * 服务端执行
     */
    public async onServer() {}
}
