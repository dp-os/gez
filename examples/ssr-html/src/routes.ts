import type { Page } from './page';

interface Route {
    path: string;
    page: () => Promise<typeof Page>;
}

export async function getRoutePage(path: string): Promise<typeof Page> {
    const routes: Route[] = [
        {
            path: '/',
            page: () => import('./views/home').then((m) => m.default)
        },
        {
            path: '/about',
            page: () => import('./views/about').then((m) => m.default)
        }
    ];
    const route = routes.find((item) => {
        return item.path === path;
    });
    if (route) {
        return route.page();
    }
    return import('./views/not-found').then((m) => m.default);
}
