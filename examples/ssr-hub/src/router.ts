import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import { createRoutes as home } from 'ssr-home/router';
import { createRoutes as about } from 'ssr-about/router';

Vue.use(Router);

export function createRoutes(): RouteConfig[] {
    return [];
}

export async function createRouter() {
    return new Router({
        mode: 'history',
        routes: [...home(), ...about()]
    });
}
