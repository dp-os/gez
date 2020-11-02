import Vue from 'vue';
import App from './app.vue';
export default async (renderContext) => {
    return new Vue({
        renderContext,
        render(h) {
            return h(App);
        }
    });
};
