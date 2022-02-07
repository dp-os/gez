import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

export function createRoutes(): RouteConfig[] {
    return [];
}

export async function createRouter() {
    /* eslint-disable import/no-unresolved */
    const { createRoutes: home } = await import('ssr-home/router');
    /* eslint-disable import/no-unresolved */
    const { createRoutes: about } = await import('ssr-about/router');
    return new Router({
        mode: 'history',
        routes: [...home(), ...about()]
    });
}
