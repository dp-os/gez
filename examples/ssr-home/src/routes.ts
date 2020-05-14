import { Router } from '@fmfe/genesis-app';

export const createRouter = () => {
    const router = new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                component: () => import('./views/index.vue')
            },
            {
                path: '/error',
                component: () => import('./views/error.vue')
            }
        ]
    });
    return router;
};
