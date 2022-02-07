import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

export function createRoutes(): RouteConfig[] {
    return [];
}

export async function createRouter() {
    /* eslint-disable import/no-unresolved */
    const { createRoutes } = await import('ssr-home/router');
    return new Router({
        mode: 'history',
        routes: [...createRoutes()]
    });
}
