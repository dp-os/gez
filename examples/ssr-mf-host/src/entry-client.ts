import { ClientOptions } from '@fmfe/genesis-core';
import { onVueCreated } from 'ssr-mf-remote/src/vue-use';
import Vue from 'vue';

import App from './app.vue';

export default async (clientOptions: ClientOptions): Promise<Vue> => {
    const app = await new Vue({
        clientOptions,
        render(h) {
            return h(App);
        }
    });
    onVueCreated(app, clientOptions);
    return app;
};
