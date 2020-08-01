import { RenderContext } from '@fmfe/genesis-core';
import Vue from 'vue';
import { createServerApp } from '@fmfe/genesis-app';
import App from './app.vue';
import { createRouter } from './routes';
import './main.css';

export default async (renderContext: RenderContext): Promise<Vue> => {
    return createServerApp({
        App,
        renderContext,
        vueOptions: {
            router: createRouter()
        }
    });
};
