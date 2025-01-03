import { layout } from 'ssr-html/src/components/layout';
import { Page } from 'ssr-html/src/page';
import { title } from '../title';

export default class NotFound extends Page {
    public title = title.notFound;
    public render(): string {
        return layout(`<h2>Not Found</h2>`);
    }
    public async onServer() {
        this.importMetaSet.add(import.meta);
        super.onServer();
    }
}
