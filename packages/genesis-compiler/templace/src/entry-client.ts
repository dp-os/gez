import { ClientData } from '@fmfe/genesis-core';
import Vue from 'vue';
import App from './app.vue';

export default async (context: ClientData): Promise<Vue> => {
    return new Vue({
        render(h) {
            return h(App);
        }
    });
};
