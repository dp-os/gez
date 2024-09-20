import { defineAsyncComponent, createApp as _createApp } from 'vue'

const App = defineAsyncComponent(() => import('./app.vue'))

export function createApp () {
    return {
        app: _createApp(App)
    }
}