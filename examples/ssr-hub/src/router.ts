import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

async function createRoutes(): Promise<RouteConfig[]> {
    return [];
}

export async function createRouter() {
    const routes = await createRoutes();

    return new Router({
        mode: 'history',
        routes
    });
}
