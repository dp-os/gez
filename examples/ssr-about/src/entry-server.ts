import { createServerApp } from '@fmfe/genesis-app';
import { RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';

import { onVueCreated } from '../../shared/vue-use';
import App from './app.vue';
import { createRouter } from './router';

export default async (renderContext: RenderContext): Promise<Vue> => {
    const router = await createRouter();
    const app = await createServerApp({
        App,
        renderContext,
        vueOptions: {
            router
        }
    });
    onVueCreated(app, renderContext);
    return app;
};
