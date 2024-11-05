import type { PageProps } from './page';
import { getRoutePage } from './routes';

async function init() {
    const props: PageProps = (window as any).__INIT_PROPS__;
    const pathname = new URL(props.url, 'file:').pathname;
    const Page = await getRoutePage(pathname);
    const page = new Page(props);
    page.state = (window as any).__INIT_STATE__;
}

init();
