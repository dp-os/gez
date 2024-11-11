import './style/global.less';
import Vue, { defineAsyncComponent } from 'vue';

const App = defineAsyncComponent(() => import('./app.vue'));

export function createApp() {
    const app = new Vue({
        render(h) {
            return h(App);
        }
    });
    return {
        app
    };
}
