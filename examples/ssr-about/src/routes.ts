import { Router } from '@fmfe/genesis-app';

export const createRouter = () => {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/about',
                component: () => import('./views/index.vue')
            }
        ]
    });
};
