import Vue from 'vue';
import App from './app.vue';
export default async (clientOptions) => {
    return new Vue({
        clientOptions,
        render(h) {
            return h(App);
        }
    });
};
