import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

export function createRoutes(): RouteConfig[] {
    return [];
}

export async function createRouter() {
    const { createRoutes } = await import('ssr-home/router');
    return new Router({
        mode: 'history',
        routes: [
            ...createRoutes()
        ]
    });
}
