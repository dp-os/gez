import { layout } from 'ssr-html/src/components/layout';
import { Page } from 'ssr-html/src/page';

export default class Home extends Page {
    public constructor(imports: ImportMeta[]) {
        imports.push(import.meta);
        super(imports);
    }
    public render(): string {
        return layout(`<h2>404</h2>`);
    }
}
