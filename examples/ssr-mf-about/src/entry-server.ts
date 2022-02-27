import { RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';

import App from './app.vue';
import { onVueCreated } from './vue-use';

export default async (renderContext: RenderContext): Promise<Vue> => {
    const app = await new Vue({
        renderContext,
        render(h) {
            return h(App);
        }
    });
    onVueCreated(app, renderContext);
    return app;
};
