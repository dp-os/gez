import Vue, { defineAsyncComponent } from 'vue'

// import App from './app.vue';
const App = defineAsyncComponent(() => import('./app.vue'))



export function createApp () {
    const app = new Vue({
        render(h) {
            return h(App)
        }
    });
    return {
        app
    }
}