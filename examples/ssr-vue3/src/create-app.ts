import { createApp as _createApp, createSSRApp } from 'vue';
import App from './app.vue';

export function createApp(target: 'client' | 'server') {
    const app = target === 'server' ? createSSRApp(App) : _createApp(App);
    return {
        app
    };
}
