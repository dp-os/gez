import * as ok from '@fmfe/genesis-app';
import { RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';

import App from './app.vue';
import { createRouter } from './routes';

export default async (renderContext: RenderContext): Promise<Vue> => {
    return ok.createServerApp({
        App,
        renderContext,
        vueOptions: {
            router: createRouter()
        }
    });
};
