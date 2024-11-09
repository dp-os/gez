import { layout } from 'ssr-html/src/components/layout';
import { Page } from 'ssr-html/src/page';

export default class NotFound extends Page {
    public render(): string {
        return layout(`<h2>Not Found</h2>`);
    }
    public async onServer() {
        this.importMeta.add(import.meta);
        super.onServer();
    }
}
