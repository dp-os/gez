import { Router } from '@fmfe/genesis-app';

export const createRouter = () => {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                meta: {
                    remoteUrl: '/api/home'
                },
                component: () => import('./app.vue')
            },
            {
                path: '/about',
                meta: {
                    remoteUrl: '/api/about'
                },
                component: () => import('./app.vue')
            }
        ]
    });
};
