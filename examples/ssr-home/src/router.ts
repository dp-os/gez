import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

export function createRoutes(): RouteConfig[] {
    return [
        {
            path: '/',
            component: () => import('./views/index.vue').then(m => m.default)
        }
    ];
}

export async function createRouter() {
    const routes = await createRoutes();

    return new Router({
        mode: 'history',
        routes
    });
}
