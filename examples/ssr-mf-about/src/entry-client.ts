import { ClientOptions } from '@fmfe/genesis-core';
import Vue from 'vue';

import App from './app.vue';
import { onVueCreated } from './vue-use';

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
