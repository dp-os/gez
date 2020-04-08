import { Router } from '@fmfe/genesis-app';

export const createRouter = () => {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '*',
                component: () => import('./views/common-header.vue')
            }
        ]
    });
};
