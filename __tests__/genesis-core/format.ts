/* eslint-disable no-undef */
import path from 'path';
import { SSR } from '../../packages/genesis-core/src/ssr';

class Home extends SSR {
    public constructor() {
        super({
            name: 'ssr-home',
            build: {
                baseDir: path.resolve(__dirname, '../../examples/ssr-home')
            }
        });
    }
}

test('format', async () => {
    const ssr = new Home();
    const renderer = ssr.createRenderer();
    const result = await renderer.renderJson();
    const format = result.context.format;
    const html = format.page(result.context.data);
    const joinHtml =
        format.style(result.context.data) +
        format.html(result.data) +
        format.scriptState(result.data) +
        format.script(result.data);
    await expect(html).toBe(joinHtml);
});
