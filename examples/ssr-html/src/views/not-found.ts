import { layout } from 'ssr-html/src/components/layout';
import { Page } from 'ssr-html/src/page';

export default class Home extends Page {
    public render(): string {
        return layout(`<h2>404</h2>`);
    }
}
