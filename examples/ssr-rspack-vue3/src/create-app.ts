import { defineAsyncComponent, createApp as _createApp, createSSRApp } from 'vue'

const App = defineAsyncComponent(() => import('./app.vue'))

export function createApp () {
    return {
        // app: _createApp(App)
        // app: createSSRApp(App)
        app: (typeof window !== 'undefined' ? _createApp :createSSRApp )(App)
    }
}