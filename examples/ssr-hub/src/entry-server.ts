import { createServerApp } from '@fmfe/genesis-app';
import { RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';

import App from './app.vue';
import { createRouter } from './router';

export default async (renderContext: RenderContext): Promise<Vue> => {
    const router = await createRouter();
    return createServerApp({
        App,
        renderContext,
        vueOptions: {
            router
        }
    });
};
