import { defineServer } from '@gez/core';
import { createApp } from './main';

export default defineServer({
    async render(context) {
        context.html = createApp.toString();
    }
});
