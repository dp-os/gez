import { ClientOptions } from '@fmfe/genesis-core';
import Vue from 'vue';
import { createClientApp } from '@fmfe/genesis-app';
import App from './app.vue';

export default async (clientOptions: ClientOptions): Promise<Vue> => {
    return createClientApp({
        App,
        clientOptions
    });
};
