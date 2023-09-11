import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
    {
        path: '/',
        // @ts-ignore
        component: () => import('./views/home.vue').then((m) => m.default)
    }
];
