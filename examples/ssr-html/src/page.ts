export interface PageProps {
    url: string;
    base: string;
}

export class Page {
    public importMetaSet = new Set<ImportMeta>();
    private _props: PageProps | null = null;
    public get props(): PageProps {
        if (this._props === null) {
            throw new Error(`props is null`);
        }
        return this._props;
    }
    public set props(props) {
        this._props = props;
    }
    public title = '';
    /**
     * 自定义页面状态
     */
    public state: Record<string, any> = {};
    /**
     * 服务端渲染生成的 HTML
     */
    public render() {
        return ``;
    }
    /**
     * 组件已经创建完成，props 和 state 已经准备就绪
     */
    public onCreated() {}
    /**
     * 客户端执行
     */
    public onClient() {}
    /**
     * 服务端执行
     */
    public async onServer() {
        this.importMetaSet.add(import.meta);
    }
}
