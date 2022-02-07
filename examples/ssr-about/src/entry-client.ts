import { createClientApp } from '@fmfe/genesis-app';
import { ClientOptions } from '@fmfe/genesis-core';
import Vue from 'vue';

import { onVueCreated } from '../../shared/vue-use';
import App from './app.vue';
import { createRouter } from './router';

export default async (clientOptions: ClientOptions): Promise<Vue> => {
    const router = await createRouter();
    const app = await createClientApp({
        App,
        clientOptions,
        vueOptions: {
            router
        }
    });
    onVueCreated(app, clientOptions);
    return app;
};
