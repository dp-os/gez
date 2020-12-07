import { RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';
import * as ok from '@fmfe/genesis-app';
import App from './app.vue';
import { createRouter } from './routes';
import './main.css';

export default async (renderContext: RenderContext): Promise<Vue> => {
    console.log('????????????', ok.createServerApp.toString());
    return ok.createServerApp({
        App,
        renderContext,
        vueOptions: {
            router: createRouter()
        }
    });
};
