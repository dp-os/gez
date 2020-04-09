import Vue from 'vue';
import { Router } from '@fmfe/genesis-app';

import RemoteView from '@fmfe/genesis-remote';
import Default from './default.vue';
Vue.use(RemoteView);

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
            },
            {
                path: '*',
                component: Default
            }
        ]
    });
    return router;
};
