import { Router } from '@fmfe/genesis-app';

export const createRouter = () => {
    return new Router({
        mode: 'abstract',
        routes: [
            {
                path: '/api/remote/common-header/',
                component: () => import('./views/common-header.vue')
            }
        ]
    });
};
