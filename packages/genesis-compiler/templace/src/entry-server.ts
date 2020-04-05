import { RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';
import App from './app.vue';

export default async (context: RenderContext): Promise<Vue> => {
    return new Vue({
        render(h) {
            return h(App);
        }
    });
};
