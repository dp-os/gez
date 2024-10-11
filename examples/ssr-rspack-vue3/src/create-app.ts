import {
    createApp as _createApp,
    createSSRApp,
    defineAsyncComponent
} from 'vue';

const App = defineAsyncComponent(() => import('./app.vue'));

export function createApp() {
    return {
        // app: _createApp(App)
        // app: createSSRApp(App)
        app: (typeof window !== 'undefined' ? _createApp : createSSRApp)(App)
    };
}
