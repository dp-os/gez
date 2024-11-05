import { App } from './app';

const app = new App({
    state: (window as any).__INIT_STATE__
});
app.mount('#app');
